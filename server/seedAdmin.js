const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@foodshare.com' });
    if (adminExists) {
      console.log('Admin already exists! Login with: admin@foodshare.com / admin123');
      process.exit(0);
    }

    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@foodshare.com',
      phone: '0000000000',
      password: 'admin123', // Will be hashed by pre-save hook
      userType: 'admin'
    });

    await adminUser.save();
    console.log('Admin account created successfully!');
    console.log('Email: admin@foodshare.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
