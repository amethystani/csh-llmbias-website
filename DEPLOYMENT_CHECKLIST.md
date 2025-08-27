# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checks

### Backend (Render)
- [ ] `requirements.txt` exists with all dependencies
- [ ] `render.yaml` configuration file is present
- [ ] `Prompts.xlsx` data file is included in repository
- [ ] Environment variables are configured for production
- [ ] CORS settings updated for production URLs
- [ ] Health endpoint (`/api/health`) works locally

### Frontend (Vercel)
- [ ] `vercel.json` configuration file is present
- [ ] API calls use environment variables via `src/config/api.ts`
- [ ] No hardcoded localhost URLs in components
- [ ] Production build works locally (`npm run build`)
- [ ] Environment variable examples provided

## 🔧 Deployment Steps

### 1. Backend Deployment (Render)
- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set Root Directory to `Backend`
- [ ] Configure build command: `pip install -r requirements.txt`
- [ ] Configure start command: `gunicorn --bind 0.0.0.0:$PORT genealogy_service:app`
- [ ] Set environment variables:
  - [ ] `FLASK_ENV=production`
  - [ ] `CORS_ORIGINS=https://your-frontend-url.vercel.app`
  - [ ] `PORT=10000`
- [ ] Deploy and get backend URL

### 2. Frontend Deployment (Vercel)
- [ ] Create new project on Vercel
- [ ] Connect GitHub repository
- [ ] Set Root Directory to `Frontend`
- [ ] Configure build settings:
  - [ ] Framework: Vite
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] Set environment variables:
  - [ ] `VITE_API_BASE_URL=https://your-backend-url.onrender.com`
  - [ ] `VITE_NODE_ENV=production`
- [ ] Deploy and get frontend URL

### 3. Final Configuration
- [ ] Update backend `CORS_ORIGINS` with actual Vercel URL
- [ ] Redeploy backend with updated CORS settings
- [ ] Update frontend `VITE_API_BASE_URL` with actual Render URL
- [ ] Redeploy frontend with updated API URL

## 🧪 Testing Checklist

### Backend Testing
- [ ] Health endpoint: `GET /api/health`
- [ ] Genealogy endpoints:
  - [ ] `GET /api/genealogy/people`
  - [ ] `GET /api/genealogy/questions/{scientist_name}`
  - [ ] `POST /api/genealogy/assessments`
- [ ] Biography endpoints:
  - [ ] `GET /api/biography/scientists`
  - [ ] `GET /api/biography/models`
  - [ ] `GET /api/biography/{scientist_name}`
- [ ] Rating endpoints:
  - [ ] `POST /api/ratings`
  - [ ] `GET /api/ratings`

### Frontend Testing
- [ ] Application loads without errors
- [ ] Search functionality works in both tabs
- [ ] Genealogy Assessment:
  - [ ] Can select scientists
  - [ ] Questions load correctly
  - [ ] Can submit answers
  - [ ] Data saves to backend
- [ ] Biography Assessment:
  - [ ] Can select scientists and models
  - [ ] Biography displays correctly
  - [ ] Can rate model responses
  - [ ] Ratings save to backend
  - [ ] Can export data

### Cross-Origin Testing
- [ ] No CORS errors in browser console
- [ ] API calls succeed from production frontend
- [ ] Data flows correctly between frontend and backend

## 🔍 URLs to Test

Replace with your actual deployed URLs:

### Backend (Render)
- Health: `https://your-backend.onrender.com/api/health`
- People: `https://your-backend.onrender.com/api/genealogy/people`
- Scientists: `https://your-backend.onrender.com/api/biography/scientists`

### Frontend (Vercel)
- Main App: `https://your-app.vercel.app`
- Genealogy Tab: `https://your-app.vercel.app` (default)
- Biography Tab: `https://your-app.vercel.app` (switch tab)

## 🚨 Common Issues & Solutions

### Backend Issues
- **ImportError:** Check `requirements.txt` has all dependencies
- **File not found:** Ensure `Prompts.xlsx` is committed to repository
- **CORS errors:** Verify `CORS_ORIGINS` matches your Vercel URL exactly
- **Port binding:** Ensure using `$PORT` environment variable

### Frontend Issues
- **Build fails:** Check all dependencies in `package.json`
- **API calls fail:** Verify `VITE_API_BASE_URL` environment variable
- **Import errors:** Check all file paths are correct
- **Environment variables:** Ensure they start with `VITE_`

### Network Issues
- **404 on API calls:** Check backend URL is correct and deployed
- **Timeout errors:** Render free tier has cold starts (15min)
- **HTTPS required:** Both platforms automatically use HTTPS

## ✅ Success Criteria

Your deployment is successful when:
- [ ] Frontend loads without errors at your Vercel URL
- [ ] Backend health check returns success at your Render URL
- [ ] You can search and select scientists in both tabs
- [ ] Assessment questions load and can be answered
- [ ] Biography data loads and can be rated
- [ ] Data saves properly to backend (check browser network tab)
- [ ] No CORS errors in browser console
- [ ] Excel files are generated on backend (check Render logs)

## 📝 Post-Deployment Notes

### Monitoring
- Monitor your apps via Vercel and Render dashboards
- Check logs for any errors or performance issues
- Set up alerts if needed

### Updates
- Push changes to GitHub main branch
- Both platforms will auto-deploy on commits
- Test changes in staging environment first if available

### Maintenance
- Free tier Render backend sleeps after 15min inactivity
- Consider upgrading to paid plans for production use
- Regularly update dependencies for security

## 🎉 Congratulations!

Your LLM Research Platform is now live in production! 🚀

**Remember to save your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
