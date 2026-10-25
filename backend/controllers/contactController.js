const asyncHandler = require('../utils/asyncHandler');

exports.submitContact = asyncHandler(async (req, res) => {
  const { name } = req.body;
  res.status(201).json({
    success: true,
    message: `Thank you, ${name}. Your message has been received. For this academic project, messages are not forwarded to an email inbox.`,
  });
});
