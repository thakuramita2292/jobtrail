import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { User } from '../schemas/user.schema.js';
import { Application } from '../schemas/application.schema.js';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Application.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create sample users
    const passwordHash = await bcrypt.hash('Password@123', 10);

    const users = await User.insertMany([
      {
        name: 'Jane Doe',
        email: 'jane@gmail.com',
        passwordHash,
        masterResume: 'Jane is a Senior Developer with 5+ years of experience...',
      },
      {
        name: 'John Smith',
        email: 'john@gmail.com',
        passwordHash,
        masterResume: 'John is a Full Stack Developer specializing in React and Node.js...',
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@gmail.com',
        passwordHash,
        masterResume: 'Sarah is a Product Manager with experience in SaaS...',
      },
    ]);

    console.log(`✓ Created ${users.length} users`);

    // Create sample applications
    const applications = await Application.insertMany([
      {
        userId: users[0]._id,
        company: 'Google',
        role: 'Senior Software Engineer',
        location: 'Mountain View, CA',
        status: 'Interview',
        jobUrl: 'https://careers.google.com/jobs/results/',
        source: 'LinkedIn',
        appliedDate: new Date('2026-10-15'),
        jobDescription: 'We are looking for an experienced Senior Software Engineer to join our team...',
        interviews: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Phone Screen',
            scheduledAt: new Date('2026-10-20'),
            completedAt: new Date('2026-10-20'),
            feedback: 'Great technical knowledge, moved to next round',
            interviewer: 'Alex Chen',
            notes: 'Discussed system design and scalability',
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Technical Round',
            scheduledAt: new Date('2026-10-25'),
          },
        ],
        notes: [
          {
            _id: new mongoose.Types.ObjectId(),
            content: 'Very interested in this role, great company culture',
          },
          {
            _id: new mongoose.Types.ObjectId(),
            content: 'Follow up on compensation details',
          },
        ],
        history: [
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Applied',
            at: new Date('2026-10-15'),
            notes: 'Initial application',
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Screening',
            at: new Date('2026-10-18'),
            notes: 'Phone screen scheduled',
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Interview',
            at: new Date('2026-10-20'),
            notes: 'Passed phone screen',
          },
        ],
      },
      {
        userId: users[0]._id,
        company: 'Microsoft',
        role: 'Software Engineer II',
        location: 'Seattle, WA',
        status: 'Offer',
        jobUrl: 'https://careers.microsoft.com/',
        source: 'Company Website',
        appliedDate: new Date('2026-09-20'),
        jobDescription: 'Join our cloud infrastructure team...',
        interviews: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Phone Screen',
            scheduledAt: new Date('2026-09-25'),
            completedAt: new Date('2026-09-25'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Technical Round',
            scheduledAt: new Date('2026-10-02'),
            completedAt: new Date('2026-10-02'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'HR Round',
            scheduledAt: new Date('2026-10-10'),
            completedAt: new Date('2026-10-10'),
          },
        ],
        notes: [
          {
            _id: new mongoose.Types.ObjectId(),
            content: 'Received offer - salary $150k + bonus',
          },
        ],
        history: [
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Applied',
            at: new Date('2026-09-20'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Screening',
            at: new Date('2026-09-23'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Interview',
            at: new Date('2026-09-25'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Offer',
            at: new Date('2026-10-12'),
          },
        ],
      },
      {
        userId: users[0]._id,
        company: 'Amazon',
        role: 'Senior Developer',
        location: 'Seattle, WA',
        status: 'Rejected',
        jobUrl: 'https://amazon.jobs/',
        source: 'Indeed',
        appliedDate: new Date('2026-09-01'),
        jobDescription: 'Build scalable backend systems...',
        interviews: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Phone Screen',
            scheduledAt: new Date('2026-09-10'),
            completedAt: new Date('2026-09-10'),
          },
        ],
        notes: [
          {
            _id: new mongoose.Types.ObjectId(),
            content: 'Did not pass phone screen',
          },
        ],
        history: [
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Applied',
            at: new Date('2026-09-01'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Screening',
            at: new Date('2026-09-08'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Rejected',
            at: new Date('2026-09-12'),
          },
        ],
      },
      {
        userId: users[1]._id,
        company: 'Meta',
        role: 'Frontend Engineer',
        location: 'Menlo Park, CA',
        status: 'Applied',
        jobUrl: 'https://metacareers.com/',
        source: 'LinkedIn',
        appliedDate: new Date('2026-10-22'),
        jobDescription: 'Build next-gen UI experiences...',
        interviews: [],
        notes: [],
        history: [
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Applied',
            at: new Date('2026-10-22'),
          },
        ],
      },
      {
        userId: users[1]._id,
        company: 'Apple',
        role: 'Software Engineer',
        location: 'Cupertino, CA',
        status: 'Wishlist',
        jobUrl: 'https://www.apple.com/jobs/',
        source: 'Company Website',
        appliedDate: null,
        jobDescription: 'Create innovative software for Apple products...',
        interviews: [],
        notes: [
          {
            _id: new mongoose.Types.ObjectId(),
            content: 'Interested but not ready to apply yet',
          },
        ],
        history: [
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Wishlist',
            at: new Date('2026-10-23'),
          },
        ],
      },
      {
        userId: users[2]._id,
        company: 'Slack',
        role: 'Product Manager',
        location: 'San Francisco, CA',
        status: 'Interview',
        jobUrl: 'https://slack.com/careers/',
        source: 'Referral',
        appliedDate: new Date('2026-10-10'),
        jobDescription: 'Lead product strategy for enterprise features...',
        interviews: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Phone Screen',
            scheduledAt: new Date('2026-10-17'),
            completedAt: new Date('2026-10-17'),
            feedback: 'Strong product sense',
          },
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Final Round',
            scheduledAt: new Date('2026-10-28'),
          },
        ],
        notes: [
          {
            _id: new mongoose.Types.ObjectId(),
            content: 'Referred by Mike Johnson',
          },
        ],
        history: [
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Applied',
            at: new Date('2026-10-10'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Screening',
            at: new Date('2026-10-15'),
          },
          {
            _id: new mongoose.Types.ObjectId(),
            status: 'Interview',
            at: new Date('2026-10-17'),
          },
        ],
      },
    ]);

    console.log(`✓ Created ${applications.length} applications`);

    // Print summary
    console.log('\n📊 Seeding Complete!\n');
    console.log('Users:');
    users.forEach((user) => {
      console.log(`  - ${user.name} (${user.email})`);
    });
    console.log(`\nApplications: ${applications.length}`);
    console.log(`  Status distribution:`);
    const statusCounts = {};
    applications.forEach((app) => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`    - ${status}: ${count}`);
    });

    await mongoose.disconnect();
    console.log('\n✓ Database seeded successfully!');
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();





