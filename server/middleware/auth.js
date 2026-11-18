import jwt from 'jsonwebtoken';
import { env} from '../config/env.js';
import { userRepository } from '../repositories/user.memory.repository.js';
import { AppError } from '../utils/AppError.js';

export async function authenticate(req, res, next) {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(401, 'UNAUTHORIZED', 'Authentication token is required')
    );
  }

  // 2. Extract the token string after "Bearer "
  const token = authHeader.slice(7).trim();

  try {
    // 3. Verify token signature, expiry, and algorithm
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
    });

    // 4. Confirm the user still exists in memory
    const user = await userRepository.findById(payload.sub);
    if (!user) {
      return next(
        new AppError(401, 'UNAUTHORIZED', 'User account no longer exists')
      );
    }

    // 5. Attach minimal user identity to req.user for downstream controllers
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    return next(
      new AppError(
        401,
        'UNAUTHORIZED',
        'Invalid or expired authentication token'
      )
    );
  }
}