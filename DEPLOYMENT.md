# 🚀 Deployment Guide

This guide walks you through deploying the LLM Research Platform to production using Vercel (frontend) and Render (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- Your Excel data files (`Prompts.xlsx`)

## 🎨 Frontend Deployment (Vercel)

### 1. Prepare Repository
```bash
# Push your code to GitHub if not already done
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - Framework: **Vite**
   - Root Directory: **Frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Set Environment Variables

In your Vercel project settings, add these environment variables:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_NODE_ENV=production
```

**Important:** Replace `your-backend-url` with your actual Render backend URL (you'll get this after backend deployment).

### 4. Deploy
- Click **"Deploy"**
- Vercel will automatically build and deploy your frontend
- You'll get a production URL like `https://your-app.vercel.app`

## 🔧 Backend Deployment (Render)

### 1. Prepare Your Repository
Make sure your backend files are in the `Backend` folder with:
- `genealogy_service.py` (main application)
- `requirements.txt` (dependencies)
- `render.yaml` (Render configuration)
- `Prompts.xlsx` (your data file)

### 2. Deploy to Render

1. **Go to [Render Dashboard](https://render.com/dashboard)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - Name: `llm-research-backend`
   - Environment: **Python 3**
   - Region: Choose closest to your users
   - Branch: **main**
   - Root Directory: **Backend**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT genealogy_service:app`

### 3. Set Environment Variables

In Render service settings, add these environment variables:

```
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.vercel.app
PORT=10000
```

**Important:** Replace `your-frontend-url` with your actual Vercel URL.

### 4. Deploy
- Click **"Create Web Service"**
- Render will build and deploy your backend
- You'll get a production URL like `https://your-backend.onrender.com`

## 🔄 Update Frontend with Backend URL

After your backend is deployed:

1. **Copy your Render backend URL**
2. **Go to Vercel Dashboard → Your Project → Settings → Environment Variables**
3. **Update VITE_API_BASE_URL** with your Render URL:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
4. **Redeploy frontend** by going to Deployments tab and clicking "Redeploy"

## 📁 File Structure for Deployment

```
your-repo/
├── Frontend/
│   ├── src/
│   │   ├── config/
│   │   │   └── api.ts          # API configuration
│   │   └── ...
│   ├── vercel.json             # Vercel configuration
│   ├── env.example             # Environment example
│   └── package.json
├── Backend/
│   ├── genealogy_service.py    # Main Flask app
│   ├── requirements.txt        # Python dependencies
│   ├── render.yaml            # Render configuration
│   ├── Prompts.xlsx           # Your Excel data
│   └── *.xlsx                 # Generated data files
└── DEPLOYMENT.md              # This guide
```

## 🔧 Environment Variables Summary

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_NODE_ENV=production
```

### Backend (Render)
```env
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend.vercel.app
PORT=10000
```

## 🧪 Testing Your Deployment

1. **Visit your Vercel URL**
2. **Test the Genealogy Assessment tab:**
   - Search for scientists
   - Answer assessment questions
   - Verify data saves properly

3. **Test the Biography Assessment tab:**
   - Search for scientists
   - Select AI models
   - Rate model responses
   - Export ratings

4. **Check backend health:**
   - Visit `https://your-backend.onrender.com/api/health`
   - Should return: `{"status": "healthy", "timestamp": "..."}`

## 🐛 Troubleshooting

### Frontend Issues
- **Build fails:** Check that all dependencies are in `package.json`
- **API calls fail:** Verify `VITE_API_BASE_URL` environment variable
- **CORS errors:** Ensure backend has correct frontend URL in `CORS_ORIGINS`

### Backend Issues
- **Service won't start:** Check `requirements.txt` has all dependencies
- **File not found:** Ensure `Prompts.xlsx` is committed to repository
- **CORS errors:** Update `CORS_ORIGINS` with your Vercel URL

### Common Solutions
1. **Check logs** in both Vercel and Render dashboards
2. **Verify environment variables** are set correctly
3. **Ensure URLs match** between frontend and backend configurations
4. **Redeploy both services** if environment variables change

## 🔄 Updates and Maintenance

### Updating the Application
1. **Make changes locally**
2. **Test thoroughly**
3. **Push to GitHub**
4. **Vercel auto-deploys** from main branch
5. **Render auto-deploys** from main branch

### Monitoring
- **Vercel Analytics:** Monitor frontend performance
- **Render Metrics:** Monitor backend performance and usage
- **Logs:** Check both platforms for errors

## 💡 Performance Tips

### Frontend (Vercel)
- ✅ Automatic CDN distribution
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Optimized builds

### Backend (Render)
- ✅ Automatic HTTPS
- ✅ Health checks
- ✅ Auto-restart on failures
- ⚠️ Free tier has cold starts (15min sleep)

## 💰 Cost Considerations

### Free Tier Limits
- **Vercel:** 100GB bandwidth, 100GB-hours compute
- **Render:** 750 hours/month, cold starts after 15min inactivity

### Upgrade Considerations
- **High traffic:** Consider Vercel Pro ($20/month)
- **Always-on backend:** Consider Render Starter ($7/month)

## 🎉 You're All Set!

Your LLM Research Platform is now deployed and ready for production use! 

**Frontend URL:** `https://your-app.vercel.app`
**Backend URL:** `https://your-backend.onrender.com`

Enjoy your deployed application! 🚀
