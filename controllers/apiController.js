const API = require('../models/API');
const Category = require('../models/Category');

// @desc    Get all APIs
// @route   GET /api/apis
// @access  Private
exports.getAPIs = async (req, res, next) => {
  try {
    const { category, type, method, search } = req.query;
    
    // Build filter - shared team platform, everyone sees all APIs
    const filter = {};
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (method) filter.method = method;
    
    let query = API.find(filter).populate('category', 'name color').populate('user', 'name email');
    
    // Text search
    if (search) {
      query = query.find({ $text: { $search: search } });
    }
    
    const apis = await query.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: apis.length,
      apis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single API
// @route   GET /api/apis/:id
// @access  Private
exports.getAPI = async (req, res, next) => {
  try {
    const api = await API.findById(req.params.id).populate('category', 'name color').populate('user', 'name email');

    if (!api) {
      return res.status(404).json({
        success: false,
        message: 'API not found'
      });
    }

    res.status(200).json({
      success: true,
      api
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create API
// @route   POST /api/apis
// @access  Private
exports.createAPI = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    // Verify category exists and belongs to user
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const api = await API.create(req.body);
    await api.populate('category', 'name color');
    await api.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'API created successfully',
      api
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update API
// @route   PUT /api/apis/:id
// @access  Private
exports.updateAPI = async (req, res, next) => {
  try {
    let api = await API.findById(req.params.id);

    if (!api) {
      return res.status(404).json({
        success: false,
        message: 'API not found'
      });
    }

    // If category is being changed, verify new category
    if (req.body.category && req.body.category !== api.category.toString()) {
      const category = await Category.findById(req.body.category);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    api = await API.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name color').populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'API updated successfully',
      api
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete API
// @route   DELETE /api/apis/:id
// @access  Private
exports.deleteAPI = async (req, res, next) => {
  try {
    const api = await API.findById(req.params.id);

    if (!api) {
      return res.status(404).json({
        success: false,
        message: 'API not found'
      });
    }

    await api.deleteOne();

    res.status(200).json({
      success: true,
      message: 'API deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search APIs
// @route   GET /api/apis/search
// @access  Private
exports.searchAPIs = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const apis = await API.find({
      user: req.user.id,
      $text: { $search: q }
    }).populate('category', 'name color');

    res.status(200).json({
      success: true,
      count: apis.length,
      apis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get API stats
// @route   GET /api/apis/stats
// @access  Private
exports.getStats = async (req, res, next) => {
  try {
    const totalAPIs = await API.countDocuments({ user: req.user.id });
    const internalAPIs = await API.countDocuments({ user: req.user.id, type: 'internal' });
    const externalAPIs = await API.countDocuments({ user: req.user.id, type: 'external' });
    const totalCategories = await Category.countDocuments({ user: req.user.id });

    const methodStats = await API.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$method', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalAPIs,
        internalAPIs,
        externalAPIs,
        totalCategories,
        methodStats
      }
    });
  } catch (error) {
    next(error);
  }
};
