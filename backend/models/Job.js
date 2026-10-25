const mongoose = require('mongoose');
const { JOB_TYPES, JOB_CATEGORIES } = require('../config/constants');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    companyName: { type: String, required: true, trim: true, maxlength: 120 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    jobType: { type: String, required: true, enum: JOB_TYPES },
    category: { type: String, required: true, enum: JOB_CATEGORIES },
    salaryRange: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, maxlength: 5000 },
    requiredSkills: { type: [String], default: [] },
    experienceRequired: { type: String, required: true, maxlength: 200 },
    applicationDeadline: { type: Date, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', companyName: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
