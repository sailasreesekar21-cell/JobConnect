const express = require('express');
const { submitContact } = require('../controllers/contactController');
const { validate } = require('../middleware/validate');
const { contactRules } = require('../middleware/validators');

const router = express.Router();

router.post('/', contactRules, validate, submitContact);

module.exports = router;
