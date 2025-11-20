const express = require('express');
const {
  getAllUsers,
  toggleUserActive,
  changeUserPassword,
  sendNotification,
  getAdminStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-active', toggleUserActive);
router.put('/users/:id/password', changeUserPassword);
router.post('/users/:id/notify', sendNotification);

module.exports = router;
