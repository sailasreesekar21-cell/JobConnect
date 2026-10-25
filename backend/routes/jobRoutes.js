const express = require('express');
const {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { jobRules, mongoIdParam, jobQueryRules } = require('../middleware/validators');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.get('/', jobQueryRules, validate, listJobs);
router.get('/recruiter/mine', protect, authorize(ROLES.RECRUITER, ROLES.ADMIN), getMyJobs);
router.get('/:id', mongoIdParam, validate, getJob);
router.post('/', protect, authorize(ROLES.RECRUITER), jobRules, validate, createJob);
router.put('/:id', protect, authorize(ROLES.RECRUITER, ROLES.ADMIN), mongoIdParam, jobRules, validate, updateJob);
router.delete('/:id', protect, authorize(ROLES.RECRUITER, ROLES.ADMIN), mongoIdParam, validate, deleteJob);

module.exports = router;
