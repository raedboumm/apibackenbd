const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('color').optional().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).withMessage('Invalid color format')
];

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getCategories)
  .post(authorize('developer', 'admin'), categoryValidation, validate, createCategory);

router.route('/:id')
  .get(getCategory)
  .put(authorize('developer', 'admin'), categoryValidation, validate, updateCategory)
  .delete(authorize('developer', 'admin'), deleteCategory);

module.exports = router;
