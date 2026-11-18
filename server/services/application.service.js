import { applicationRepository } from '../repositories/application.memory.repository.js';
import { AppError } from '../utils/AppError.js';

export const APPLICATION_STATUSES = [
  'Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn',
];

function formatHistoryDate() {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getMondayUtcIsoDate(dateObj) {
  const d = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export const applicationService = {
  console.log('Application Service initialized'),
  async createApplication(userId, input) {
    if (!input.company || !input.company.trim()) throw new AppError(400, 'VALIDATION_ERROR', 'Company is required');
    if (!input.role || !input.role.trim()) throw new AppError(400, 'VALIDATION_ERROR', 'Role is required');

    const initialStatus = input.status || 'Wishlist';
    if (!APPLICATION_STATUSES.includes(initialStatus)) {
      throw new AppError(400, 'VALIDATION_ERROR', `Invalid status. Allowed: ${APPLICATION_STATUSES.join(', ')}`);
    }

    const now = new Date().toISOString();
    const appliedDate = input.appliedDate !== undefined && input.appliedDate !== '' 
      ? input.appliedDate 
      : (initialStatus !== 'Wishlist' ? now.slice(0, 10) : null);

    const recordData = {
      company: input.company.trim(),
      role: input.role.trim(),
      location: input.location?.trim() ?? '',
      status: initialStatus,
      jobUrl: input.jobUrl?.trim() ?? '',
      source: input.source?.trim() ?? '',
      appliedDate,
      jobDescription: input.jobDescription?.trim() ?? '',
      notes: Array.isArray(input.notes) ? input.notes : [],
      interviews: Array.isArray(input.interviews) ? input.interviews : [],
      history: Array.isArray(input.history) && input.history.length > 0
        ? input.history
        : [{ status: initialStatus, at: formatHistoryDate() }],
      createdAt: now,
      updatedAt: now,
    };

    return applicationRepository.create(userId, recordData);
  },

  async getApplicationById(userId, id) {
    const record = await applicationRepository.findById(userId, id);
    if (!record) throw new AppError(404, 'APPLICATION_NOT_FOUND', 'Application not found');
    return record;
  },

  async listApplications(userId, query = {}) {
    const search = query.search?.trim() || '';
    const status = query.status?.trim() || '';
    const sort = query.sort || 'appliedDate';
    const order = query.order === 'asc' ? 'asc' : 'desc';
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

    let records = await applicationRepository.findMany(userId);

    if (search) {
      const q = search.toLowerCase();
      records = records.filter((app) => app.company.toLowerCase().includes(q) || app.role.toLowerCase().includes(q));
    }

    if (status) {
      if (!APPLICATION_STATUSES.includes(status)) throw new AppError(400, 'VALIDATION_ERROR', `Invalid status filter: ${status}`);
      records = records.filter((app) => app.status === status);
    }

    const total = records.length;
    const dir = order === 'asc' ? 1 : -1;
    
    records.sort((a, b) => {
      const valA = a[sort] ?? '';
      const valB = b[sort] ?? '';
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return String(a.id).localeCompare(String(b.id));
    });

    const offset = (page - 1) * limit;
    const data = records.slice(offset, offset + limit);

    return { data, page, limit, total };
  },

  async updateApplication(userId, id, changes) {
    const existing = await this.getApplicationById(userId, id);

    if (changes.status && !APPLICATION_STATUSES.includes(changes.status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `Invalid status: ${changes.status}`);
    }

    let updatedHistory = changes.history || existing.history || [];
    if (changes.status && changes.status !== existing.status && !changes.history) {
      updatedHistory = [...updatedHistory, { status: changes.status, at: formatHistoryDate() }];
    }

    return applicationRepository.update(userId, id, { ...changes, history: updatedHistory, updatedAt: new Date().toISOString() });
  },

  async changeStatus(userId, id, status) {
    if (!status || !APPLICATION_STATUSES.includes(status)) {
      throw new AppError(400, 'VALIDATION_ERROR', `Invalid status. Allowed: ${APPLICATION_STATUSES.join(', ')}`);
    }

    const existing = await this.getApplicationById(userId, id);
    const updatedHistory = existing.status === status
      ? existing.history
      : [...(existing.history || []), { status, at: formatHistoryDate() }];

    return applicationRepository.update(userId, id, { status, history: updatedHistory, updatedAt: new Date().toISOString() });
  },

  async deleteApplication(userId, id) {
    await this.getApplicationById(userId, id);
    await applicationRepository.remove(userId, id);
  },

  async getStats(userId) {
    const records = await applicationRepository.findMany(userId);
    const byStatus = Object.fromEntries(APPLICATION_STATUSES.map((s) => [s, 0]));
    
    for (const app of records) {
      if (byStatus[app.status] !== undefined) byStatus[app.status] += 1;
    }

    const currentMondayDate = new Date(`${getMondayUtcIsoDate(new Date())}T00:00:00.000Z`);
    const weekBuckets = new Map();
    
    for (let i = 7; i >= 0; i -= 1) {
      const d = new Date(currentMondayDate);
      d.setUTCDate(d.getUTCDate() - i * 7);
      weekBuckets.set(d.toISOString().slice(0, 10), 0);
    }

    for (const app of records) {
      if (!app.appliedDate) continue;
      const parsed = new Date(`${app.appliedDate}T00:00:00.000Z`);
      if (Number.isNaN(parsed.getTime())) continue;
      const weekKey = getMondayUtcIsoDate(parsed);
      if (weekBuckets.has(weekKey)) weekBuckets.set(weekKey, weekBuckets.get(weekKey) + 1);
    }

    const weekly = Array.from(weekBuckets.entries()).map(([weekStart, count], index) => ({
      week: index + 1, weekStart, count,
    }));

    return { total: records.length, byStatus, counts: { ...byStatus, Interviewing: byStatus.Interview, Offers: byStatus.Offer }, weekly };
  },
};