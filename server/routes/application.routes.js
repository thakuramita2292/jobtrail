import { Router } from 'express';
import { applicationController } from '../controllers/application.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Protect ALL application routes with JWT verification
router.use(authenticate);

// MUST register /stats before /:id, otherwise 'stats' is treated as an ID!
router.get('/stats', applicationController.stats);
router.post('/', applicationController.create);
router.get('/', applicationController.list);
router.get('/:id', applicationController.getById);
router.patch('/:id', applicationController.update);
router.patch('/:id/status', applicationController.changeStatus);
router.delete('/:id', applicationController.remove);

export default router;