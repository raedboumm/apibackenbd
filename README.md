# API Platform Backend

Complete Node.js + Express + MongoDB backend for API Management Platform.

## 🚀 Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Password Management (Change password)
- ✅ Category Management (CRUD operations)
- ✅ API Management (Full CRUD with search)
- ✅ Role-based Access Control
- ✅ Data validation
- ✅ Error handling
- ✅ Security (Helmet, CORS, Rate limiting)
- ✅ MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/api-platform
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

4. **Start the server:**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

Server will run on: `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── userController.js   # User CRUD operations
│   ├── categoryController.js # Category management
│   └── apiController.js    # API management
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Global error handler
│   └── validate.js        # Request validation
├── models/
│   ├── User.js            # User model
│   ├── Category.js        # Category model
│   └── API.js             # API model
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   ├── userRoutes.js      # User routes
│   ├── categoryRoutes.js  # Category routes
│   └── apiRoutes.js       # API routes
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── README.md
└── server.js              # Entry point
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/password` - Change password (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Categories
- `GET /api/categories` - Get all categories (Protected)
- `GET /api/categories/:id` - Get category by ID (Protected)
- `POST /api/categories` - Create category (Protected)
- `PUT /api/categories/:id` - Update category (Protected)
- `DELETE /api/categories/:id` - Delete category (Protected)

### APIs
- `GET /api/apis` - Get all APIs (Protected)
- `GET /api/apis/:id` - Get API by ID (Protected)
- `POST /api/apis` - Create API (Protected)
- `PUT /api/apis/:id` - Update API (Protected)
- `DELETE /api/apis/:id` - Delete API (Protected)
- `GET /api/apis/search?q=term` - Search APIs (Protected)
- `GET /api/apis/stats` - Get statistics (Protected)

### Health Check
- `GET /health` - Check server status

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example Requests

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Category
```bash
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Authentication",
  "description": "Authentication related APIs",
  "color": "#FF6B6B"
}
```

### Create API
```bash
POST /api/apis
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "User Login",
  "url": "https://api.example.com/auth/login",
  "method": "POST",
  "category": "category_id_here",
  "type": "external",
  "description": "Authenticate user and return token",
  "authType": "bearer",
  "tags": ["auth", "login"]
}
```

## 🛠️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/api-platform |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |

## 🔄 MongoDB Atlas Setup (Optional)

If you want to use MongoDB Atlas instead of local MongoDB:

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Get connection string
4. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/api-platform
```

## 📊 Testing

Test the API using:
- Postman
- Thunder Client (VS Code extension)
- curl
- Your React frontend

## 🐛 Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access if using MongoDB Atlas

**JWT errors:**
- Ensure JWT_SECRET is set in .env
- Check token format in Authorization header

**Port already in use:**
- Change PORT in .env
- Kill process using the port

## 📦 Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- helmet - Security headers
- morgan - HTTP logging
- express-validator - Request validation
- express-rate-limit - Rate limiting

## 🚀 Next Steps

1. Install dependencies: `npm install`
2. Configure `.env` file
3. Start MongoDB
4. Run server: `npm run dev`
5. Connect frontend to backend
6. Test all endpoints

## 📄 License

MIT
