import { applicationService } from '../services/application.service.js';

export const applicationController = {
  async create(req, res) {
    const created = await applicationService.createApplication(req.user.id, req.body);
    res.status(201).json({ data: created });
  },

  async list(req, res) {
    const result = await applicationService.listApplications(req.user.id, req.query);
    res.status(200).json(result);
  },

  async stats(req, res) {
    const stats = await applicationService.getStats(req.user.id);
    res.status(200).json({ data: stats });
  },

  async getById(req, res) {
    const record = await applicationService.getApplicationById(req.user.id, req.params.id);
    res.status(200).json({ data: record });
  },

  async update(req, res) {
    const updated = await applicationService.updateApplication(req.user.id, req.params.id, req.body);
    res.status(200).json({ data: updated });
  },

  async changeStatus(req, res) {
    const updated = await applicationService.changeStatus(req.user.id, req.params.id, req.body.status);
    res.status(200).json({ data: updated });
  },

  async remove(req, res) {
    await applicationService.deleteApplication(req.user.id, req.params.id);
    res.status(204).send();
  },
};
