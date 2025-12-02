# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Phase 1: Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Note down:
   - Database URL
   - Service Role Key
   - Anon Public Key

### Step 2: Run Migration
1. Go to Supabase Dashboard → SQL Editor
2. Copy & paste `supabase-migration.sql`
3. Execute the script
4. Verify tables are created

### Step 3: Update Database Connection
- Replace `backend/database/db.js` with `db-postgres.js`
- Install PostgreSQL driver: `npm install pg`

## Phase 2: Backend Deployment (Render)

### Step 1: Prepare Backend
1. Update import in all model files:
   ```javascript
   // Replace mysql2 imports with PostgreSQL queries
   import db from '../database/db-postgres.js';
   ```

### Step 2: Deploy to Render
1. Push code to GitHub
2. Go to https://render.com
3. Create new **Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Step 3: Environment Variables in Render
```
NODE_ENV=production
DB_HOST=your-supabase-host.supabase.co
DB_USER=postgres
DB_PASSWORD=your-supabase-password
DB_NAME=postgres
DB_PORT=5432
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-vercel-app.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Phase 3: Frontend Deployment (Vercel)

### Step 1: Update API Base URL
In `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app.onrender.com/api'
  : 'http://localhost:8080/api';
```

### Step 2: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend folder
3. Run: `vercel --prod`
4. Follow prompts

### Step 3: Environment Variables in Vercel
```
VITE_API_BASE_URL=https://your-render-app.onrender.com/api
```

## Phase 4: Final Configuration

### Update CORS in Backend
```javascript
// In server.js
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'https://your-vercel-app.vercel.app'
    ],
    credentials: true
};
```

### Test Production
1. Frontend: https://your-vercel-app.vercel.app
2. Backend: https://your-render-app.onrender.com
3. Database: Supabase Dashboard

## 📝 Quick Commands

### Install PostgreSQL driver
```bash
cd backend
npm install pg
npm uninstall mysql2
```

### Test local PostgreSQL connection
```bash
npm run dev
# Check console for "Connected to Supabase PostgreSQL database"
```

### Update all model files
- Replace `mysql.format()` with PostgreSQL parameterized queries
- Update SELECT/INSERT/UPDATE syntax if needed

## 🔧 Troubleshooting

### Common Issues:
1. **CORS Error**: Update CORS origin in backend
2. **Database Connection**: Check Supabase credentials
3. **Cookie Issues**: Ensure secure: false for HTTPS
4. **Build Errors**: Check import paths and dependencies

### Query Migration Tips:
- MySQL `?` → PostgreSQL `$1, $2, $3`
- `LIMIT ?` → `LIMIT $1`
- `AUTO_INCREMENT` → `SERIAL`
- `DATETIME` → `TIMESTAMP`