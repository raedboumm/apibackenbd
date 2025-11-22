const mongoose = require('mongoose');
require('dotenv').config();

// API Schema
const apiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  endpoint: { type: String, required: true },
  method: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  accessLevel: { type: String, enum: ['external', 'partner', 'internal'], default: 'internal' },
  protocol: { type: String, enum: ['REST', 'WebSocket', 'GraphQL'], default: 'REST' },
  version: { type: String, default: '1.0.0' },
  status: { type: String, enum: ['stable', 'beta', 'deprecated'], default: 'stable' },
  rateLimit: { type: String, default: '1000 req/min' },
  usage: { type: Number, default: 0 },
  successRate: { type: Number, default: 99.0 },
  responseTime: { type: Number, default: 120 },
  authentication: { type: String, default: 'API Key' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const API = mongoose.model('API', apiSchema);

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

// Sample data
const categories = [
  { name: 'Religious Services', description: 'Prayer times, Quran, Islamic content', icon: '🕌' },
  { name: 'Events', description: 'Event management and scheduling', icon: '📅' },
  { name: 'Media', description: 'Live streaming and broadcasting', icon: '📡' },
  { name: 'Visitor Management', description: 'Visitor tracking and statistics', icon: '👥' },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await API.deleteMany({});
    await Category.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('✓ Created categories');

    // Find category IDs
    const religiousCategory = createdCategories.find(c => c.name === 'Religious Services');
    const eventsCategory = createdCategories.find(c => c.name === 'Events');
    const mediaCategory = createdCategories.find(c => c.name === 'Media');
    const visitorCategory = createdCategories.find(c => c.name === 'Visitor Management');

    // Create sample APIs with realistic usage data
    const apis = [
      {
        name: 'Prayer Times API',
        description: 'Get prayer times for any location worldwide. Supports multiple calculation methods.',
        endpoint: '/api/v1/prayer-times',
        method: 'GET',
        category: religiousCategory._id,
        accessLevel: 'external',
        protocol: 'REST',
        version: '1.0.0',
        status: 'stable',
        rateLimit: '1000 req/min',
        usage: 25432,
        successRate: 99.8,
        responseTime: 85,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      },
      {
        name: 'Events API',
        description: 'Manage and retrieve upcoming events, lectures, and programs.',
        endpoint: '/api/v1/events',
        method: 'GET',
        category: eventsCategory._id,
        accessLevel: 'partner',
        protocol: 'REST',
        version: '1.0.0',
        status: 'stable',
        rateLimit: '500 req/min',
        usage: 12876,
        successRate: 99.5,
        responseTime: 120,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      },
      {
        name: 'Live Stream API',
        description: 'Access live streaming URLs and schedules for religious broadcasts.',
        endpoint: '/api/v1/live-stream',
        method: 'GET',
        category: mediaCategory._id,
        accessLevel: 'external',
        protocol: 'REST',
        version: '1.0.0',
        status: 'stable',
        rateLimit: '200 req/min',
        usage: 6926,
        successRate: 98.9,
        responseTime: 95,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      },
      {
        name: 'Visitor Statistics API',
        description: 'Track and analyze visitor data and statistics.',
        endpoint: '/api/v1/visitors/stats',
        method: 'GET',
        category: visitorCategory._id,
        accessLevel: 'internal',
        protocol: 'REST',
        version: '1.0.0',
        status: 'stable',
        rateLimit: '100 req/min',
        usage: 3456,
        successRate: 99.9,
        responseTime: 110,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        name: 'Quran API',
        description: 'Access Quran verses, translations, and recitations.',
        endpoint: '/api/v1/quran',
        method: 'GET',
        category: religiousCategory._id,
        accessLevel: 'external',
        protocol: 'REST',
        version: '2.0.0',
        status: 'stable',
        rateLimit: '2000 req/min',
        usage: 18543,
        successRate: 99.7,
        responseTime: 75,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // 75 days ago
      },
      {
        name: 'Event Registration API',
        description: 'Register attendees for events and programs.',
        endpoint: '/api/v1/events/register',
        method: 'POST',
        category: eventsCategory._id,
        accessLevel: 'partner',
        protocol: 'REST',
        version: '1.0.0',
        status: 'beta',
        rateLimit: '100 req/min',
        usage: 1234,
        successRate: 98.5,
        responseTime: 145,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        name: 'Broadcast Schedule API',
        description: 'Get upcoming broadcast schedules and program information.',
        endpoint: '/api/v1/broadcast/schedule',
        method: 'GET',
        category: mediaCategory._id,
        accessLevel: 'external',
        protocol: 'REST',
        version: '1.0.0',
        status: 'stable',
        rateLimit: '500 req/min',
        usage: 8765,
        successRate: 99.6,
        responseTime: 90,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // 50 days ago
      },
      {
        name: 'Visitor Check-in API',
        description: 'Register visitor check-ins and track attendance.',
        endpoint: '/api/v1/visitors/checkin',
        method: 'POST',
        category: visitorCategory._id,
        accessLevel: 'internal',
        protocol: 'REST',
        version: '1.0.0',
        status: 'stable',
        rateLimit: '200 req/min',
        usage: 5432,
        successRate: 99.4,
        responseTime: 130,
        authentication: 'API Key',
        createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
      },
    ];

    await API.insertMany(apis);
    console.log('✓ Created APIs with usage data');

    // Summary
    console.log('\n📊 Seed Summary:');
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   APIs: ${apis.length}`);
    console.log(`   Total API Calls: ${apis.reduce((sum, api) => sum + api.usage, 0).toLocaleString()}`);
    console.log('\n✅ Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
