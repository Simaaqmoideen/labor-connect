const bcrypt = require('bcryptjs');
const { sequelize } = require('./models');
const Admin = require('./models/Admin');
const JobProvider = require('./models/JobProvider');
const Worker = require('./models/Worker');

async function seed() {
  try {
    await sequelize.sync(); // Ensure tables exist

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Admin
    const admin = await Admin.findOne({ where: { email: 'admin@example.com' }});
    if (!admin) {
      await Admin.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password_hash: passwordHash
      });
      console.log('Admin user created: admin@example.com / password123');
    }

    // 2. Provider
    const provider = await JobProvider.findOne({ where: { email: 'provider@example.com' }});
    if (!provider) {
      await JobProvider.create({
        name: 'Test Provider',
        email: 'provider@example.com',
        password_hash: passwordHash,
        phone: '1234567890',
        company_name: 'Test Corp'
      });
      console.log('Provider user created: provider@example.com / password123');
    }

    // 3. Worker
    const worker = await Worker.findOne({ where: { email: 'worker@example.com' }});
    if (!worker) {
      await Worker.create({
        name: 'Test Worker',
        email: 'worker@example.com',
        password_hash: passwordHash,
        phone: '0987654321',
        skills: 'Plumbing, Electrical',
        experience_years: 5,
        hourly_rate: 20
      });
      console.log('Worker user created: worker@example.com / password123');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
