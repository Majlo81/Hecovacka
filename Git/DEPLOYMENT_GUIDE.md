# 🚀 Hecovačka - Deployment Guide

## 🎯 Quick Start (Development)

### Prerequisites
- Node.js 16+ 
- npm or yarn

### 1. Backend Setup
```bash
cd server
npm install
npm start
```
**Backend runs on:** `http://localhost:3000`

### 2. PWA Frontend Setup
```bash
cd pwa
# Start simple HTTP server
python -m http.server 8090
# OR
npx http-server -p 8090
```
**PWA runs on:** `http://localhost:8090`

### 3. Test the Application
1. Open `http://localhost:8090` in browser
2. Register new user: `test@example.com` / `heslo123`
3. Test all features: dashboard, groups, history, hecovačky

---

## 🌐 Production Deployment

### Backend Deployment Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
heroku create hecovacka-backend
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-connection-string
git push heroku main
```

#### Option 2: Railway
```bash
# Connect GitHub repo to Railway
# Set environment variables:
# - JWT_SECRET
# - MONGODB_URI
# - PORT (auto-set by Railway)
```

#### Option 3: DigitalOcean App Platform
```yaml
# app.yaml
name: hecovacka-backend
services:
- name: api
  source_dir: /server
  github:
    repo: your-username/hecovacka
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: JWT_SECRET
    value: your-secret-key
  - key: NODE_ENV
    value: production
```

### Frontend Deployment Options

#### Option 1: Netlify
```bash
# Build command: (none - static files)
# Publish directory: pwa
# Deploy via drag & drop or GitHub integration
```

#### Option 2: Vercel
```bash
vercel --cwd pwa
# OR connect GitHub repo
```

#### Option 3: GitHub Pages
```bash
# Enable GitHub Pages in repo settings
# Set source to /pwa folder
```

---

## 🔧 Environment Configuration

### Backend Environment Variables
```env
# Required
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=3000

# Database (Production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hecovacka

# Optional
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### Frontend Configuration
Update API base URL in `pwa/index.html`:
```javascript
// Change from:
const API_BASE_URL = 'http://localhost:3000';

// To:
const API_BASE_URL = 'https://your-backend-domain.com';
```

---

## 📊 Database Migration

### From In-Memory to Production MongoDB

1. **Setup MongoDB Atlas**
   - Create free cluster at mongodb.com
   - Create database user
   - Get connection string

2. **Update Backend Configuration**
   ```javascript
   // server/src/config/database.js
   const connectDB = async () => {
     try {
       await mongoose.connect(process.env.MONGODB_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
       });
       console.log('✅ MongoDB connected successfully!');
     } catch (error) {
       console.error('❌ Database connection error:', error);
       process.exit(1);
     }
   };
   ```

3. **Remove In-Memory MongoDB**
   ```bash
   npm uninstall mongodb-memory-server
   ```

---

## 🔒 Security Checklist

### Production Security
- [ ] Strong JWT secret (32+ characters)
- [ ] HTTPS enabled for both frontend and backend
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Error messages sanitized

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Add caching headers
- [ ] Optimize images and assets
- [ ] Enable service worker caching
- [ ] Monitor performance metrics

---

## 📱 PWA Installation

### Mobile Installation
1. Open PWA in mobile browser
2. Tap "Add to Home Screen" when prompted
3. App installs like native app
4. Works offline with service worker

### Desktop Installation
1. Open PWA in Chrome/Edge
2. Click install icon in address bar
3. App installs as desktop application

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check Node.js version (16+)
- Verify environment variables
- Check MongoDB connection

**PWA won't load:**
- Verify backend is running
- Check CORS configuration
- Update API_BASE_URL

**Login fails:**
- Re-register user after backend restart
- Check JWT_SECRET configuration
- Verify rate limiting settings

**Real-time features not working:**
- Check Socket.io connection
- Verify WebSocket support
- Check firewall/proxy settings

---

## 📈 Monitoring & Analytics

### Recommended Tools
- **Backend:** New Relic, DataDog, or Heroku metrics
- **Frontend:** Google Analytics, Sentry for error tracking
- **Database:** MongoDB Atlas monitoring
- **Uptime:** Pingdom, UptimeRobot

---

## 🎯 Next Steps After Deployment

1. **User Testing**
   - Share with beta users
   - Collect feedback
   - Monitor usage patterns

2. **Feature Enhancements**
   - Advanced statistics
   - Push notifications
   - AI motivational messages

3. **Scaling Preparation**
   - Database indexing
   - CDN setup
   - Load balancing

---

**🎉 Your Hecovačka MVP is ready for the world! 🚀**
