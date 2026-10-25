const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeUser } = require('../utils/sanitizeUser');
const { getConfig } = require('../config/env');
const { ROLES } = require('../config/constants');

function signToken(user) {
  const { jwtSecret, jwtExpiresIn } = getConfig();
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, companyName } = req.body;

  if (![ROLES.JOB_SEEKER, ROLES.RECRUITER].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid account type.' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone: phone || '',
    companyName: role === ROLES.RECRUITER ? companyName || '' : '',
  });

  const token = signToken(user);
  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token,
    user: sanitizeUser(user),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = signToken(user);
  res.json({
    success: true,
    message: 'Logged in successfully.',
    token,
    user: sanitizeUser(user),
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});
