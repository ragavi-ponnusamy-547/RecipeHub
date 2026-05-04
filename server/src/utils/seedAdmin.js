const User = require('../models/User');

const seedAdmin = async () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_USERNAME, ADMIN_PROFILE_PIC } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_NAME || !ADMIN_USERNAME) {
    return;
  }

  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  if (existingAdmin) {
    return;
  }

  await User.create({
    name: ADMIN_NAME,
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    profilePic:
      ADMIN_PROFILE_PIC ||
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'admin',
  });

  console.log('Admin account seeded');
};

module.exports = seedAdmin;