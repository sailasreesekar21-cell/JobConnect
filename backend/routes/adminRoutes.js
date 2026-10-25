const express = require('express');
const {
  getStats,
  getUsers,
  getRecruiters,
  getJobs,
  getApplications,
  deleteJob,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { mongoIdParam } = require('../middleware/validators');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/recruiters', getRecruiters);
router.get('/jobs', getJobs);
router.get('/applications', getApplications);
router.delete('/jobs/:id', mongoIdParam, validate, deleteJob);

module.exports = router;
