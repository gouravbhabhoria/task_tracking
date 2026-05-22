const ActivityLog = require('../models/ActivityLog');

// @desc    Get activity logs
// @route   GET /api/activities
// @access  Admin only
const getActivityLogs = async (req, res, next) => {
  try {
    const { action, user: userId, page = 1, limit = 20 } = req.query;

    let query = {};

    if (action) query.action = action;
    if (userId) query.user = userId;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ActivityLog.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivityLogs };
