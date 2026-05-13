/**
 * Run this script once to create the admin user:
 *   node seedAdmin.js
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const email = 'admin@vasudhastore.com';
  const existing = await User.findOne({ email });

  if (existing) {
    // Force-update password and role in case it was wrong
    existing.password = await bcrypt.hash('Admin@12345', 12);
    existing.role = 'admin';
    existing.name = 'Admin';
    await existing.save({ validateBeforeSave: false });
    console.log('✅ Admin user updated successfully');
  } else {
    await User.create({
      name: 'Admin',
      email,
      password: 'Admin@12345',
      role: 'admin',
    });
    console.log('✅ Admin user created successfully');
  }

  console.log('📧 Email:', email);
  console.log('🔑 Password: Admin@12345');
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
