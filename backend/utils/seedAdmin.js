const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  await connectDB();

  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Super Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'active',
    });

    console.log('✅ Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
