/**
 * Creates one administrator account using values from backend/.env
 * This is the only supported way to create an admin. Registration cannot create admins.
 */
const { getConfig } = require('../config/env');
const { connectDatabase, disconnectDatabase } = require('../config/db');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running this script.');
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters.');
  }

  const config = getConfig();
  await connectDatabase(config.mongoUri);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new Error('A user with this email already exists. Choose another ADMIN_EMAIL.');
  }

  await User.create({
    name,
    email,
    password,
    role: ROLES.ADMIN,
  });

  console.log(`Administrator created for ${email}. Store this password securely and do not commit it.`);
}

createAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
