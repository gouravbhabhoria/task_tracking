const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  getStats,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/roleMiddleware');

// All admin routes require auth + admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getStats);

router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/users/:id/status').put(updateUserStatus);

router.route('/tasks').get(getAllTasks);

module.exports = router;
