const { body, param, query } = require('express-validator');
const { ROLES, JOB_TYPES, JOB_CATEGORIES, APPLICATION_STATUSES } = require('../config/constants');

const passwordRule = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long.');

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  passwordRule,
  body('role')
    .isIn([ROLES.JOB_SEEKER, ROLES.RECRUITER])
    .withMessage('Role must be jobseeker or recruiter.'),
  body('phone').optional({ values: 'falsy' }).isLength({ max: 20 }),
  body('companyName').optional({ values: 'falsy' }).isLength({ max: 120 }),
];

const loginRules = [
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const profileRules = [
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('phone').optional({ values: 'falsy' }).isLength({ max: 20 }),
  body('education').optional({ values: 'falsy' }).isLength({ max: 500 }),
  body('experience').optional({ values: 'falsy' }).isLength({ max: 1000 }),
  body('skills').optional().isArray().withMessage('Skills must be a list.'),
  body('companyName').optional({ values: 'falsy' }).isLength({ max: 120 }),
  body('companyDescription').optional({ values: 'falsy' }).isLength({ max: 1000 }),
  body('companyWebsite').optional({ values: 'falsy' }).isLength({ max: 200 }),
];

const jobRules = [
  body('title').trim().notEmpty().withMessage('Job title is required.').isLength({ max: 140 }),
  body('companyName').trim().notEmpty().withMessage('Company name is required.').isLength({ max: 120 }),
  body('location').trim().notEmpty().withMessage('Location is required.').isLength({ max: 120 }),
  body('jobType').isIn(JOB_TYPES).withMessage('Select a valid job type.'),
  body('category').isIn(JOB_CATEGORIES).withMessage('Select a valid category.'),
  body('salaryRange').trim().notEmpty().withMessage('Salary range is required.'),
  body('description').trim().notEmpty().withMessage('Job description is required.').isLength({ max: 5000 }),
  body('requiredSkills').optional().isArray(),
  body('experienceRequired').trim().notEmpty().withMessage('Experience requirement is required.'),
  body('applicationDeadline').isISO8601().withMessage('Enter a valid application deadline.'),
];

const applyRules = [
  body('jobId').isMongoId().withMessage('A valid job is required.'),
  body('resumeUrl')
    .trim()
    .notEmpty()
    .withMessage('Resume URL is required.')
    .isURL()
    .withMessage('Enter a valid resume URL.'),
  body('coverLetter').optional({ values: 'falsy' }).isLength({ max: 2000 }),
];

const statusRules = [
  param('id').isMongoId().withMessage('Invalid application id.'),
  body('status').isIn(APPLICATION_STATUSES).withMessage('Select a valid application status.'),
];

const mongoIdParam = [param('id').isMongoId().withMessage('Invalid id.')];

const jobQueryRules = [
  query('title').optional().isString(),
  query('company').optional().isString(),
  query('location').optional().isString(),
  query('category').optional().isString(),
];

const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required.').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Enter a valid email address.'),
  body('message').trim().notEmpty().withMessage('Message is required.').isLength({ max: 2000 }),
];

module.exports = {
  registerRules,
  loginRules,
  profileRules,
  jobRules,
  applyRules,
  statusRules,
  mongoIdParam,
  jobQueryRules,
  contactRules,
};
