const express = require('express');
const { body } = require('express-validator');
const {
  getAPIs,
  getAPI,
  createAPI,
  updateAPI,
  deleteAPI,
  searchAPIs,
  getStats
} = require('../controllers/apiController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation rules
const apiValidation = [
  body('name').trim().notEmpty().withMessage('API name is required'),
  body('url').trim().notEmpty().withMessage('URL is required'),
  body('method').isIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).withMessage('Invalid HTTP method'),
  body('category').notEmpty().withMessage('Category is required'),
  body('type').isIn(['internal', 'external']).withMessage('Invalid type'),
  body('description').trim().notEmpty().withMessage('Description is required')
];

// All routes require authentication
router.use(protect);

router.get('/search', searchAPIs);
router.get('/stats', getStats);

router.route('/')
  .get(getAPIs)
  .post(authorize('developer', 'admin'), apiValidation, validate, createAPI);

router.route('/:id')
  .get(getAPI)
  .put(authorize('developer', 'admin'), apiValidation, validate, updateAPI)
  .delete(authorize('developer', 'admin'), deleteAPI);

module.exports = router;
