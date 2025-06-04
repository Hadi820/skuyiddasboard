# Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker & Docker Compose installed
- Domain name configured
- SSL certificate (Let's Encrypt recommended)

#### Steps
1. **Clone and Setup**
   \`\`\`bash
   git clone <repository-url>
   cd hotel-management-system
   chmod +x scripts/deploy.sh
   \`\`\`

2. **Configure Environment**
   \`\`\`bash
   cp .env.example .env.production
   # Edit .env.production with production values
   \`\`\`

3. **Deploy**
   \`\`\`bash
   ./scripts/deploy.sh production
   \`\`\`

### Option 2: Separate Service Deployment

#### Backend Deployment (Railway/Heroku)
\`\`\`bash
# Build backend
cd backend
npm run build

# Deploy to Railway
railway login
railway link
railway up

# Or deploy to Heroku
heroku create hotel-backend
git subtree push --prefix backend heroku main
\`\`\`

#### Frontend Deployment (Vercel/Netlify)
\`\`\`bash
# Deploy to Vercel
cd frontend
vercel --prod

# Or deploy to Netlify
npm run build
netlify deploy --prod --dir=.next
\`\`\`

#### Database Deployment (Supabase/PlanetScale)
\`\`\`bash
# Supabase
supabase init
supabase db push

# PlanetScale
pscale database create hotel-management
pscale connect hotel-management main
\`\`\`

### Option 3: VPS Deployment

#### Server Setup (Ubuntu 20.04+)
\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install Nginx
sudo apt install nginx

# Install PM2
sudo npm install -g pm2
\`\`\`

#### Application Setup
\`\`\`bash
# Clone repository
git clone <repository-url>
cd hotel-management-system

# Install dependencies
npm install

# Build applications
npm run build

# Setup database
sudo -u postgres createdb hotel_management
npm run migrate
npm run seed

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@host:5432/hotel_management
DATABASE_SSL=true

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3001

# CORS
FRONTEND_URL=https://your-domain.com

# Redis (Optional)
REDIS_URL=redis://user:password@host:6379

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=us-east-1
\`\`\`

#### Frontend (.env.production)
\`\`\`env
# API
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://your-domain.com

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=1234567

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_CHAT=true
\`\`\`

## 🔒 Security Checklist

### Backend Security
- [ ] Environment variables secured
- [ ] JWT secret is strong and unique
- [ ] Database credentials are secure
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection protection
- [ ] XSS protection headers
- [ ] HTTPS enforced

### Frontend Security
- [ ] API keys not exposed in client code
- [ ] CSP headers configured
- [ ] Secure cookies for authentication
- [ ] XSS protection
- [ ] Input sanitization
- [ ] Secure routing

### Infrastructure Security
- [ ] Firewall configured
- [ ] SSH key authentication
- [ ] Regular security updates
- [ ] Database backups automated
- [ ] SSL certificate installed
- [ ] Monitoring and logging setup

## 📊 Monitoring & Logging

### Application Monitoring
\`\`\`bash
# Install monitoring tools
npm install --save winston morgan helmet

# Setup log aggregation
# - Use ELK Stack (Elasticsearch, Logstash, Kibana)
# - Or use cloud services like DataDog, New Relic
\`\`\`

### Health Checks
\`\`\`typescript
// backend/src/routes/health.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  })
})
\`\`\`

### Database Monitoring
\`\`\`sql
-- Monitor database performance
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public';
\`\`\`

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
\`\`\`yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Your deployment script here
          ./scripts/deploy.sh production
\`\`\`

## 📈 Performance Optimization

### Backend Optimization
- [ ] Database indexing optimized
- [ ] Query optimization
- [ ] Caching implemented (Redis)
- [ ] Connection pooling
- [ ] Compression enabled
- [ ] CDN for static assets

### Frontend Optimization
- [ ] Code splitting implemented
- [ ] Images optimized
- [ ] Bundle size optimized
- [ ] Lazy loading
- [ ] Service worker for caching
- [ ] Performance monitoring

## 🔧 Maintenance

### Regular Tasks
\`\`\`bash
# Database maintenance
npm run db:vacuum
npm run db:analyze

# Log rotation
logrotate /etc/logrotate.d/hotel-app

# Security updates
npm audit fix
apt update && apt upgrade

# Backup
./scripts/backup.sh
\`\`\`

### Monitoring Commands
\`\`\`bash
# Check application status
pm2 status

# View logs
pm2 logs hotel-backend
pm2 logs hotel-frontend

# Monitor resources
htop
df -h
free -m
\`\`\`

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
\`\`\`bash
# Check database status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Restart database
sudo systemctl restart postgresql
\`\`\`

#### Application Not Starting
\`\`\`bash
# Check logs
pm2 logs

# Check port usage
netstat -tulpn | grep :3001

# Restart application
pm2 restart all
\`\`\`

#### High Memory Usage
\`\`\`bash
# Check memory usage
free -m
ps aux --sort=-%mem | head

# Restart if needed
pm2 restart all
\`\`\`

### Emergency Procedures
1. **Database Backup**: `./scripts/backup.sh emergency`
2. **Rollback Deployment**: `./scripts/rollback.sh`
3. **Scale Resources**: Increase server resources
4. **Contact Support**: Have monitoring alerts ready

---

**Remember**: Always test deployments in staging environment first!
