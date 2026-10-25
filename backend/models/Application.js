const mongoose = require('mongoose');
const { APPLICATION_STATUSES } = require('../config/constants');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true, trim: true, maxlength: 400 },
    coverLetter: { type: String, default: '', maxlength: 2000 },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Pending',
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
