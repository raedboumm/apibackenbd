require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const API = require('../models/API');

const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await API.deleteMany({});

    // Create demo user
    console.log('👤 Creating demo user...');
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Authentication',
        description: 'User authentication and authorization APIs',
        color: '#FF6B6B',
        user: user._id
      },
      {
        name: 'Payment',
        description: 'Payment processing and transaction APIs',
        color: '#4ECDC4',
        user: user._id
      },
      {
        name: 'Social Media',
        description: 'Social media integration APIs',
        color: '#45B7D1',
        user: user._id
      },
      {
        name: 'Analytics',
        description: 'Data analytics and reporting APIs',
        color: '#96CEB4',
        user: user._id
      },
      {
        name: 'Notification',
        description: 'Push notifications and messaging APIs',
        color: '#FFEAA7',
        user: user._id
      }
    ]);

    // Create APIs
    console.log('🔌 Creating APIs...');
    await API.insertMany([
      {
        name: 'User Login',
        url: 'https://api.example.com/auth/login',
        method: 'POST',
        category: categories[0]._id,
        type: 'external',
        description: 'Authenticate user with email and password',
        documentation: '# User Login\n\nAuthenticates a user and returns a JWT token.\n\n## Request Body\n```json\n{\n  "email": "user@example.com",\n  "password": "password123"\n}\n```',
        authType: 'none',
        requestBody: '{\n  "email": "user@example.com",\n  "password": "password123"\n}',
        responseExample: '{\n  "success": true,\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": {\n    "id": "123",\n    "email": "user@example.com",\n    "name": "John Doe"\n  }\n}',
        tags: ['auth', 'login', 'jwt'],
        user: user._id
      },
      {
        name: 'Get User Profile',
        url: 'https://api.example.com/users/me',
        method: 'GET',
        category: categories[0]._id,
        type: 'external',
        description: 'Get current authenticated user profile',
        documentation: '# Get User Profile\n\nReturns the authenticated user\'s profile information.\n\n## Headers\n```\nAuthorization: Bearer {token}\n```',
        authType: 'bearer',
        authDetails: { tokenType: 'Bearer' },
        responseExample: '{\n  "id": "123",\n  "email": "user@example.com",\n  "name": "John Doe",\n  "role": "user"\n}',
        tags: ['auth', 'profile', 'user'],
        user: user._id
      },
      {
        name: 'Process Payment',
        url: 'https://api.stripe.com/v1/charges',
        method: 'POST',
        category: categories[1]._id,
        type: 'external',
        description: 'Process a credit card payment',
        documentation: '# Process Payment\n\nCreates a new charge using Stripe API.\n\n## Authentication\nAPI Key required in header.',
        authType: 'api-key',
        authDetails: { headerName: 'Authorization', keyPrefix: 'Bearer' },
        requestBody: '{\n  "amount": 2000,\n  "currency": "usd",\n  "source": "tok_visa",\n  "description": "Example charge"\n}',
        responseExample: '{\n  "id": "ch_1234567890",\n  "amount": 2000,\n  "currency": "usd",\n  "status": "succeeded"\n}',
        tags: ['payment', 'stripe', 'charge'],
        user: user._id
      },
      {
        name: 'Get Facebook Posts',
        url: 'https://graph.facebook.com/v12.0/me/posts',
        method: 'GET',
        category: categories[2]._id,
        type: 'external',
        description: 'Retrieve user posts from Facebook',
        documentation: '# Get Facebook Posts\n\nFetches posts from the authenticated user\'s Facebook timeline.',
        authType: 'oauth',
        authDetails: { provider: 'Facebook', scope: 'user_posts' },
        queryParams: [
          { key: 'fields', value: 'id,message,created_time', required: true },
          { key: 'limit', value: '25', required: false }
        ],
        responseExample: '{\n  "data": [\n    {\n      "id": "123456789",\n      "message": "Hello World!",\n      "created_time": "2023-01-01T12:00:00+0000"\n    }\n  ]\n}',
        tags: ['social', 'facebook', 'posts'],
        user: user._id
      },
      {
        name: 'Send Analytics Event',
        url: 'https://api.example.com/analytics/events',
        method: 'POST',
        category: categories[3]._id,
        type: 'internal',
        description: 'Track user events for analytics',
        documentation: '# Send Analytics Event\n\nRecords a user event for analytics tracking.',
        authType: 'api-key',
        requestBody: '{\n  "event": "button_click",\n  "userId": "user123",\n  "properties": {\n    "button_name": "signup",\n    "page": "homepage"\n  }\n}',
        responseExample: '{\n  "success": true,\n  "eventId": "evt_123456"\n}',
        tags: ['analytics', 'tracking', 'events'],
        user: user._id
      },
      {
        name: 'Send Push Notification',
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        category: categories[4]._id,
        type: 'external',
        description: 'Send push notification via Firebase Cloud Messaging',
        documentation: '# Send Push Notification\n\nSends a push notification to devices using FCM.',
        authType: 'api-key',
        authDetails: { headerName: 'Authorization', keyPrefix: 'key=' },
        requestBody: '{\n  "to": "device_token",\n  "notification": {\n    "title": "Hello!",\n    "body": "This is a notification"\n  }\n}',
        responseExample: '{\n  "multicast_id": 123456789,\n  "success": 1,\n  "failure": 0\n}',
        tags: ['notification', 'fcm', 'push'],
        user: user._id
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: 1 (demo@example.com / password123)`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   APIs: 6`);
    console.log('\n🚀 You can now login with:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
