require('dotenv').config();
const { Worker } = require('./models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const seedWorkers = async () => {
  try {
    const password_hash = await bcrypt.hash('Test@1234', 10);
    
    const dummyWorkers = [
      {
        name: 'Ramesh Gowda',
        email: 'ramesh@example.com',
        phone: '9876500001',
        password_hash,
        bio: 'Expert electrician with 6 years experience in residential wiring.',
        skills: ['Wiring', 'Lighting', 'Inverter Service'],
        category: 'Electrician',
        experience_yrs: 6,
        wage_per_day: 750,
        working_area: 'Mangaluru',
        availability: 'available',
        is_verified: true,
        rating_avg: 4.8,
        rating_count: 15,
        lat: 12.924,
        lng: 74.852
      },
      {
        name: 'Anil D’Souza',
        email: 'anil@example.com',
        phone: '9876500002',
        password_hash,
        bio: 'Professional plumber specializing in bathroom fittings and leak detection.',
        skills: ['Plumbing', 'Leak Fixing', 'Water Heater Repair'],
        category: 'Plumber',
        experience_yrs: 4,
        wage_per_day: 600,
        working_area: 'Mangaluru',
        availability: 'available',
        is_verified: true,
        rating_avg: 4.2,
        rating_count: 7,
        lat: 12.912,
        lng: 74.861
      },
      {
        name: 'Basavaraj Hiremath',
        email: 'basavaraj@example.com',
        phone: '9876500003',
        password_hash,
        bio: 'Carpenter with expertise in modular kitchens and furniture repair.',
        skills: ['Carpentry', 'Modular Kitchen', 'Furniture Assembly'],
        category: 'Carpenter',
        experience_yrs: 8,
        wage_per_day: 850,
        working_area: 'Mangaluru',
        availability: 'available',
        is_verified: true,
        rating_avg: 4.6,
        rating_count: 10,
        lat: 12.932,
        lng: 74.845
      },
      {
        name: 'Somanna Gowder',
        email: 'somanna@example.com',
        phone: '9876500004',
        password_hash,
        bio: 'Professional wall painter with 10 years experience in interior/exterior design.',
        skills: ['Painting', 'Wall Putty', 'Texture Painting'],
        category: 'Painter',
        experience_yrs: 10,
        wage_per_day: 700,
        working_area: 'Mangaluru',
        availability: 'busy',
        is_verified: true,
        rating_avg: 4.5,
        rating_count: 18,
        lat: 12.905,
        lng: 74.838
      },
      {
        name: 'Krishna Murthy',
        email: 'krishna@example.com',
        phone: '9876500005',
        password_hash,
        bio: 'Reliable mason for all brickwork, plastering, and concrete jobs.',
        skills: ['Masonry', 'Plastering', 'Tiling'],
        category: 'Mason',
        experience_yrs: 5,
        wage_per_day: 800,
        working_area: 'Mangaluru',
        availability: 'available',
        is_verified: true,
        rating_avg: 4.4,
        rating_count: 9,
        lat: 12.921,
        lng: 74.869
      }
    ];

    for (const w of dummyWorkers) {
      const existing = await Worker.findOne({
        where: {
          [Op.or]: [
            { email: w.email },
            { phone: w.phone }
          ]
        }
      });
      
      if (!existing) {
        await Worker.create(w);
        console.log(`Created worker: ${w.name}`);
      } else {
        console.log(`Worker already exists: ${w.name}`);
      }
    }
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedWorkers();
