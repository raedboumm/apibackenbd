const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
