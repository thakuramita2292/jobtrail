import crypto from 'node:crypto';

const applications = new Map();

function clone(record) {
  return record ? structuredClone(record) : null;
}

function daysAgo(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

function daysAhead(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const applicationRepository = {
  async create(userId, data) {
    const id = crypto.randomUUID();
    const record = { ...structuredClone(data), id, userId };
    applications.set(id, record);
    return clone(record);
  },

  async findById(userId, id) {
    const record = applications.get(id);
    if (!record || record.userId !== userId) return null;
    return clone(record);
  },

  async findMany(userId) {
    const list = [];
    for (const record of applications.values()) {
      if (record.userId === userId) {
        list.push(clone(record));
      }
    }
    return list;
  },

  async update(userId, id, changes) {
    const existing = applications.get(id);
    if (!existing || existing.userId !== userId) return null;

    const updated = {
      ...existing,
      ...structuredClone(changes),
      id: existing.id,
      userId: existing.userId,
    };
    applications.set(id, updated);
    return clone(updated);
  },

  async remove(userId, id) {
    const existing = applications.get(id);
    if (!existing || existing.userId !== userId) return false;
    return applications.delete(id);
  },
};

// Seed sample applications for Jane Doe (demo-user-jane-1)
const now = new Date().toISOString();
const seedApps = [
  {
    company: 'Tech Corp',
    role: 'Senior Developer',
    location: 'Remote',
    status: 'Interview',
    jobUrl: 'https://example.com/job/1',
    source: 'LinkedIn',
    appliedDate: daysAgo(2),
    jobDescription: 'Leading frontend architecture with React and TypeScript.',
    notes: [{ id: 'n-1', text: 'HR screen went great!', createdAt: 'Oct 15, 2026' }],
    interviews: [{ id: 'iv-1', type: 'Technical Round', scheduledAt: daysAhead(3) }],
    history: [
      { status: 'Applied', at: daysAgo(5) },
      { status: 'Interview', at: daysAgo(2) },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    company: 'Vercel',
    role: 'Frontend Engineer',
    location: 'Remote',
    status: 'Offer',
    jobUrl: 'https://vercel.com/careers',
    source: 'Referral',
    appliedDate: daysAgo(12),
    jobDescription: 'Working on Next.js developer experience.',
    notes: [],
    interviews: [],
    history: [
      { status: 'Applied', at: daysAgo(12) },
      { status: 'Interview', at: daysAgo(7) },
      { status: 'Offer', at: daysAgo(1) },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

for (const app of seedApps) {
  applicationRepository.create('demo-user-jane-1', app);
}
