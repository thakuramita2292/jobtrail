import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public routes (no token required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route (requires Authorization: Bearer )
router.get('/me', authenticate, authController.me);

export default router;