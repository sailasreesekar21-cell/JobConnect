const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeUser } = require('../utils/sanitizeUser');
const { ROLES } = require('../config/constants');

exports.getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitizeUser(req.user) });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'education', 'experience', 'skills'];
  if (req.user.role === ROLES.RECRUITER) {
    allowed.push('companyName', 'companyDescription', 'companyWebsite');
  }

  const updates = {};
  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updates[field] = req.body[field];
    }
  }

  if (updates.skills) {
    updates.skills = updates.skills
      .map((skill) => String(skill).trim())
      .filter(Boolean)
      .slice(0, 30);
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, message: 'Profile updated.', user: sanitizeUser(user) });
});
