# Backend Deployment Guide - Your Own Server

## 📦 What You Have:
- MongoDB Atlas configured and ready
- Frontend built and deployed at: https://haramain.smart-ai-agents.cloud/api-managment
- Backend ready to deploy

## 🚀 Deployment Steps:

### 1. Upload Backend to Server
Upload the entire `backend` folder to your server (e.g., `/home/api-platform/backend`)

### 2. Install Dependencies on Server
SSH into your server and run:
```bash
cd /path/to/backend
npm install --production
```

### 3. Set Environment Variables
Copy production environment file:
```bash
cp .env.production .env
```

Or create `.env` file directly on server with:
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://raedboumn_db_user:I41WUommRrKdrk2w@cluster0.dpmuprd.mongodb.net/api-platform?retryWrites=true&w=majority
JWT_SECRET=9xK2mN8pQ5vR7wT4yU6iO1aS3dF8gH0jK2lZ5xC7vB9nM4qW6eR8tY0uI3oP5aS
CLIENT_URL=https://haramain.smart-ai-agents.cloud/api-managment
```

### 4. Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 5. Start Backend with PM2
```bash
cd /path/to/backend
pm2 start server.js --name api-platform-backend
pm2 save
pm2 startup
```

### 6. Configure Reverse Proxy

#### If Using Nginx:
Create config file: `/etc/nginx/sites-available/api-backend`

```nginx
server {
    listen 80;
    server_name haramain.smart-ai-agents.cloud;

    # Frontend location
    location /api-managment {
        root /path/to/your/front;
        try_files $uri $uri/ /api-managment/index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/api-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. Update Frontend Configuration
Your frontend needs to know where the backend is. It should call:
```
https://haramain.smart-ai-agents.cloud/api
```

## ✅ Verification Steps:

1. **Test Backend Health:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"success": true, "message": "API Platform Backend is running"}`

2. **Test from Outside:**
   ```bash
   curl https://haramain.smart-ai-agents.cloud/api/health
   ```

3. **Check PM2 Status:**
   ```bash
   pm2 status
   pm2 logs api-platform-backend
   ```

## 🔒 Security Checklist:
- ✅ MongoDB connection string secured
- ✅ Strong JWT secret
- ✅ NODE_ENV=production
- ✅ HTTPS enabled
- ✅ CORS configured for your frontend only

## 🐛 Troubleshooting:

**Backend won't start:**
```bash
pm2 logs api-platform-backend
```

**Can't connect to MongoDB:**
- Verify IP whitelist in MongoDB Atlas includes your server IP
- Test connection string

**CORS errors:**
- Make sure CLIENT_URL matches frontend URL exactly
- Check browser console for specific error

## 📝 Useful PM2 Commands:
```bash
pm2 list              # List all processes
pm2 restart api-platform-backend
pm2 stop api-platform-backend
pm2 delete api-platform-backend
pm2 logs api-platform-backend
pm2 monit            # Monitor in real-time
```
