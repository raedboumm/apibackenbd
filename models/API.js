const mongoose = require('mongoose');

const APISchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an API name'],
    trim: true,
    maxlength: [100, 'API name cannot be more than 100 characters']
  },
  url: {
    type: String,
    required: [true, 'Please provide an API URL'],
    trim: true
  },
  method: {
    type: String,
    required: [true, 'Please provide HTTP method'],
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    uppercase: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  type: {
    type: String,
    required: true,
    enum: ['internal', 'external', 'partner'],
    default: 'external'
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  documentation: {
    type: String,
    default: ''
  },
  authType: {
    type: String,
    enum: ['none', 'bearer', 'basic', 'api-key', 'oauth'],
    default: 'none'
  },
  authDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  headers: [{
    key: String,
    value: String,
    required: Boolean
  }],
  queryParams: [{
    key: String,
    value: String,
    required: Boolean
  }],
  requestBody: {
    type: String,
    default: ''
  },
  responseExample: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  version: {
    type: String,
    default: '1.0'
  },
  rateLimit: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
APISchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('API', APISchema);
