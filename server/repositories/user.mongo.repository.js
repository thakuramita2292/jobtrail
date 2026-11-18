import { User } from '../schemas/user.schema.js';
import bcrypt from 'bcrypt';

function cloneSafe(user) {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : user;
  const { passwordHash, ...safeUser } = userObj;
  return safeUser;
}

export const userRepository = {
  async create({ name, email, passwordHash, masterResume = '' }) {
    try {
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        masterResume,
      });
      return cloneSafe(user);
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  },

  async findByEmail(email) {
    const normalized = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalized }).select('+passwordHash');
    if (!user) return null;
    return user.toObject();
  },

  async findById(id) {
    const user = await User.findById(id);
    return cloneSafe(user);
  },

  async update(id, changes) {
    const user = await User.findByIdAndUpdate(
      id,
      {
        name: changes.name,
        masterResume: changes.masterResume,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
    return cloneSafe(user);
  },

  async seedDemoUser() {
    const existing = await this.findByEmail('jane@gmail.com');
    if (existing) return existing;

    const passwordHash = await bcrypt.hash('Password@123', 10);
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@gmail.com',
      passwordHash,
      masterResume: '',
    });
    return cloneSafe(user);
  },
};





