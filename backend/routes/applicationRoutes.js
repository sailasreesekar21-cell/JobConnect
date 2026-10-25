const express = require('express');
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  getApplication,
  updateStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { applyRules, statusRules, mongoIdParam } = require('../middleware/validators');
const { ROLES } = require('../config/constants');
const { param } = require('express-validator');

const router = express.Router();

router.post('/', protect, authorize(ROLES.JOB_SEEKER), applyRules, validate, applyToJob);
router.get('/mine', protect, authorize(ROLES.JOB_SEEKER, ROLES.ADMIN), getMyApplications);
router.get(
  '/job/:jobId',
  protect,
  authorize(ROLES.RECRUITER, ROLES.ADMIN),
  param('jobId').isMongoId().withMessage('Invalid job id.'),
  validate,
  getJobApplications
);
router.get('/:id', protect, mongoIdParam, validate, getApplication);
router.patch(
  '/:id/status',
  protect,
  authorize(ROLES.RECRUITER, ROLES.ADMIN),
  statusRules,
  validate,
  updateStatus
);

module.exports = router;
