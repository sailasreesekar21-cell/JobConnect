const Job = require('../models/Job');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/constants');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

exports.listJobs = asyncHandler(async (req, res) => {
  const { title, company, location, category, featured } = req.query;
  const filter = {};

  if (title) filter.title = { $regex: escapeRegex(title), $options: 'i' };
  if (company) filter.companyName = { $regex: escapeRegex(company), $options: 'i' };
  if (location) filter.location = { $regex: escapeRegex(location), $options: 'i' };
  if (category) filter.category = category;

  const query = Job.find(filter).sort({ createdAt: -1 }).populate('postedBy', 'name companyName');
  if (featured === 'true') {
    query.limit(6);
  }

  const jobs = await query;
  res.json({ success: true, count: jobs.length, jobs });
});

exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name companyName companyDescription');
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  res.json({ success: true, job });
});

exports.createJob = asyncHandler(async (req, res) => {
  const job = await Job.create({
    ...req.body,
    postedBy: req.user._id,
    companyName: req.body.companyName || req.user.companyName,
    isDemo: false,
  });
  res.status(201).json({ success: true, message: 'Job posted successfully.', job });
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'You can only edit jobs that you posted.' });
  }

  const fields = [
    'title',
    'companyName',
    'location',
    'jobType',
    'category',
    'salaryRange',
    'description',
    'requiredSkills',
    'experienceRequired',
    'applicationDeadline',
  ];
  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      job[field] = req.body[field];
    }
  });
  await job.save();
  res.json({ success: true, message: 'Job updated.', job });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'You can only delete jobs that you posted.' });
  }

  await Application.deleteMany({ job: job._id });
  await job.deleteOne();
  res.json({ success: true, message: 'Job listing removed.' });
});

exports.getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: jobs.length, jobs });
});
