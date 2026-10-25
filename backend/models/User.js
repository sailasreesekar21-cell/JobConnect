const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES } = require('../config/constants');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    phone: { type: String, trim: true, default: '', maxlength: 20 },
    skills: { type: [String], default: [] },
    education: { type: String, default: '', maxlength: 500 },
    experience: { type: String, default: '', maxlength: 1000 },
    companyName: { type: String, default: '', maxlength: 120 },
    companyDescription: { type: String, default: '', maxlength: 1000 },
    companyWebsite: { type: String, default: '', maxlength: 200 },
    isDemoAccount: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
