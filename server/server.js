// server/server.js
import app from './app.js';
import { env } from './config/env.js';
import { connectMongoDB } from './config/mongodb.js';

let userRepository;
let applicationRepository;

async function loadRepositories() {
  if (env.DB_TYPE === 'mongodb') {
    const { userRepository: mongoUserRepo } = await import('./repositories/user.mongo.repository.js');
    const { applicationRepository: mongoAppRepo } = await import('./repositories/application.mongo.repository.js');
    userRepository = mongoUserRepo;
    applicationRepository = mongoAppRepo;
  } else {
    const { userRepository: memoryUserRepo } = await import('./repositories/user.memory.repository.js');
    const { applicationRepository: memoryAppRepo } = await import('./repositories/application.memory.repository.js');
    userRepository = memoryUserRepo;
    applicationRepository = memoryAppRepo;
  }
}

async function start() {
  try {
    await loadRepositories();

    if (env.DB_TYPE === 'mongodb') {
      await connectMongoDB();
    }

    const demoUser = await userRepository.seedDemoUser();
    await applicationRepository.seedDemoApplication(demoUser.id);

    app.listen(env.PORT, () => {
      console.log(`JobTrail Server listening on http://localhost:${env.PORT} (DB_TYPE=${env.DB_TYPE})`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

