import crypto from 'node:crypto';
import bcrypt from 'bcrypt';

const users = new Map();

// Seed demo user on startup: jane@gmail.com / Password@123
const demoUser = {
  id: 'demo-user-jane-1',
  name: 'Jane Doe',
  email: 'jane@gmail.com',
  passwordHash: bcrypt.hashSync('Password@123', 10),
  masterResume: '',
  createdAt: new Date().toISOString(),
};
users.set(demoUser.id, demoUser);

export const userRepository = {
  async findByEmail(email) {
    const normalized = email.trim().toLowerCase();
    for (const user of users.values()) {
      if (user.email === normalized) {
        return structuredClone(user);
      }
    }
    return null;
  },

  async findById(id) {
    const user = users.get(id);
    if (!user) return null;
    const { passwordHash, ...safeUser } = structuredClone(user);
    return safeUser;
  },

  async create({ name, email, passwordHash }) {
    const id = crypto.randomUUID();
    const newUser = {
      id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      masterResume: '',
      createdAt: new Date().toISOString(),
    };

    users.set(id, newUser);

    // Log current users in memory so you can see registrations in your terminal
    console.log(
      '--- USERS IN MEMORY ---',
      Array.from(users.values()).map((u) => ({ id: u.id, name: u.name, email: u.email }))
    );

    const { passwordHash: _, ...safeUser } = structuredClone(newUser);
    return safeUser;
  },
};