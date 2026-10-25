const Application = require('../models/Application');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const { ROLES } = require('../config/constants');

exports.applyToJob = asyncHandler(async (req, res) => {
  const { jobId, resumeUrl, coverLetter } = req.body;
  const job = await Job.findById(jobId);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }

  if (new Date(job.applicationDeadline) < new Date()) {
    return res.status(400).json({ success: false, message: 'The application deadline has passed.' });
  }

  const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
  if (existing) {
    return res.status(409).json({ success: false, message: 'You have already applied for this job.' });
  }

  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    recruiter: job.postedBy,
    resumeUrl,
    coverLetter: coverLetter || '',
  });

  res.status(201).json({ success: true, message: 'Application submitted.', application });
});

exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate('job')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: applications.length, applications });
});

exports.getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found.' });
  }
  if (String(job.postedBy) !== String(req.user._id) && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'You can only view applicants for your own jobs.' });
  }

  const applications = await Application.find({ job: job._id })
    .populate('applicant', 'name email phone skills education experience')
    .sort({ createdAt: -1 });

  res.json({ success: true, job, count: applications.length, applications });
});

exports.getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('job')
    .populate('applicant', 'name email phone skills education experience');

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  const isOwnerRecruiter = String(application.recruiter) === String(req.user._id);
  const isApplicant = String(application.applicant._id) === String(req.user._id);
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (!isOwnerRecruiter && !isApplicant && !isAdmin) {
    return res.status(403).json({ success: false, message: 'You cannot view this application.' });
  }

  res.json({ success: true, application });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate('job');
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }
  if (String(application.recruiter) !== String(req.user._id) && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ success: false, message: 'You can only update applications for your jobs.' });
  }

  application.status = req.body.status;
  await application.save();
  res.json({ success: true, message: 'Application status updated.', application });
});
