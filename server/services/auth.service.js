import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.mongo.repository.js';
import { AppError } from '../utils/AppError.js';

export const authService = {

    // REGISTER USER
    async register({ name, email, password }) {
        if (!name || !email || !password) {
            throw new AppError(
                400,
                'VALIDATION_ERROR',
                'Name, email and password are required'
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await userRepository.findByEmail(normalizedEmail);

        if (existingUser) {
            throw new AppError(
                409,
                'USER_EXISTS',
                'Email is already registered'
            );
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await userRepository.create({
            name,
            email: normalizedEmail,
            passwordHash,
        });

        const token = jwt.sign({}, env.JWT_SECRET, {
            subject: String(user._id),
            expiresIn: '1h',
            algorithm: 'HS256',
        });

        const { passwordHash: _, ...safeUser } = user;

        return {
            user: safeUser,
            token,
        };
    },

    // LOGIN USER
    async login({ email, password }) {
        if (!email || !password) {
            throw new AppError(
                400,
                'VALIDATION_ERROR',
                'Email and password are required'
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const userWithHash = await userRepository.findByEmail(normalizedEmail);

        if (!userWithHash) {
            throw new AppError(
                401,
                'INVALID_CREDENTIALS',
                'Invalid email or password'
            );
        }

        const isMatch = await bcrypt.compare(
            password,
            userWithHash.passwordHash
        );

        if (!isMatch) {
            throw new AppError(
                401,
                'INVALID_CREDENTIALS',
                'Invalid email or password'
            );
        }

        const token = jwt.sign({}, env.JWT_SECRET, {
            subject: String(userWithHash._id),
            expiresIn: '1h',
            algorithm: 'HS256',
        });

        const { passwordHash: _, ...safeUser } = userWithHash;

        return {
            user: safeUser,
            token,
        };
    },
};