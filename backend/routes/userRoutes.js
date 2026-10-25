const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { profileRules } = require('../middleware/validators');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, profileRules, validate, updateProfile);

module.exports = router;
