const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { sanitizeUser } = require('../utils/sanitizeUser');
const { ROLES } = require('../config/constants');

exports.getStats = asyncHandler(async (req, res) => {
  const [users, seekers, recruiters, admins, jobs, applications] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: ROLES.JOB_SEEKER }),
    User.countDocuments({ role: ROLES.RECRUITER }),
    User.countDocuments({ role: ROLES.ADMIN }),
    Job.countDocuments(),
    Application.countDocuments(),
  ]);

  res.json({
    success: true,
    stats: { users, seekers, recruiters, admins, jobs, applications },
  });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: ROLES.JOB_SEEKER }).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users: users.map(sanitizeUser) });
});

exports.getRecruiters = asyncHandler(async (req, res) => {
  const recruiters = await User.find({ role: ROLES.RECRUITER }).sort({ createdAt: -1 });
  res.json({ success: true, count: recruiters.length, recruiters: recruiters.map(sanitizeUser) });
});

exports.getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('postedBy', 'name email companyName').sort({ createdAt: -1 });
  res.json({ success: true, count: jobs.length, jobs });
});

exports.getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate('job', 'title companyName')
    .populate('applicant', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: applications.length, applications });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ success: true, message: 'Job listing deleted by administrator.' });
});
