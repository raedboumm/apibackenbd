const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private/Admin
exports.toggleUserActive = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block yourself'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    // Send notification to user
    if (!user.isActive) {
      await Notification.create({
        user: user._id,
        title: 'Account Status',
        message: 'Your account has been blocked by an administrator.',
        type: 'warning',
        sender: req.user.id
      });
    } else {
      await Notification.create({
        user: user._id,
        title: 'Account Status',
        message: 'Your account has been unblocked. You can now login.',
        type: 'success',
        sender: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'blocked'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password (Admin only)
// @route   PUT /api/admin/users/:id/password
// @access  Private/Admin
exports.changeUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Send notification to user
    await Notification.create({
      user: user._id,
      title: 'Password Changed',
      message: 'Your password has been changed by an administrator. Please use your new password to login.',
      type: 'warning',
      sender: req.user.id
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send notification to user
// @route   POST /api/admin/users/:id/notify
// @access  Private/Admin
exports.sendNotification = async (req, res, next) => {
  try {
    const { title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const notification = await Notification.create({
      user: user._id,
      title,
      message,
      type: type || 'info',
      sender: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const blockedUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        adminUsers,
        recentRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
};
