require('dotenv').config();
const { JobProvider } = require('./models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const seedProviders = async () => {
  try {
    const password_hash = await bcrypt.hash('Test@1234', 10);
    
    const dummyProviders = [
      {
        name: 'John D’Souza',
        email: 'john@example.com',
        phone: '9876590001',
        password_hash,
        company_name: 'Adyar Constructions',
        address: 'Adyar, Mangaluru',
        is_verified: true,
        lat: 12.928,
        lng: 74.885
      },
      {
        name: 'Manoj Hegde',
        email: 'hegde@example.com',
        phone: '9876590002',
        password_hash,
        company_name: 'Bajal Builders',
        address: 'Bajal, Mangaluru',
        is_verified: true,
        lat: 12.905,
        lng: 74.862
      },
      {
        name: 'Shekhar Poojary',
        email: 'shekhar@example.com',
        phone: '9876590003',
        password_hash,
        company_name: 'Kulashekara Electricals',
        address: 'Kulashekara, Mangaluru',
        is_verified: true,
        lat: 12.938,
        lng: 74.871
      },
      {
        name: 'Umesh Shenoy',
        email: 'shenoy@example.com',
        phone: '9876590004',
        password_hash,
        company_name: 'Ullal Enterprises',
        address: 'Ullal, Mangaluru',
        is_verified: true,
        lat: 12.871,
        lng: 74.848
      },
      {
        name: 'Austin D’Almeida',
        email: 'austin@example.com',
        phone: '9876590005',
        password_hash,
        company_name: 'Mangaluru Builders Ltd.',
        address: 'Kodialbail, Mangaluru',
        is_verified: true,
        lat: 12.915,
        lng: 74.852
      }
    ];

    for (const p of dummyProviders) {
      const existing = await JobProvider.findOne({
        where: {
          [Op.or]: [
            { email: p.email },
            { phone: p.phone }
          ]
        }
      });
      
      if (!existing) {
        await JobProvider.create(p);
        console.log(`Created provider: ${p.name} (${p.company_name})`);
      } else {
        console.log(`Provider already exists: ${p.name}`);
      }
    }
    console.log('Seeding providers complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding providers:', error);
    process.exit(1);
  }
};

seedProviders();
