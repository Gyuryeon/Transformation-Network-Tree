# Deploy to GitHub Pages - Step by Step Guide

This guide will help you deploy your Christmas Tree app so anyone can access it online!

## Overview

You need to deploy:
1. **Backend** → Free hosting service (Render/Railway)
2. **Frontend** → GitHub Pages (free!)

---

## Step 1: Create GitHub Repository

### 1.1 Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit - Christmas Tree app with backend"
```

### 1.2 Create Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `Christmastreedesign` (or any name you like)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (you already have files)
6. Click **"Create repository"**

### 1.3 Push Your Code

GitHub will show you commands. Run these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/Christmastreedesign.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Deploy Backend to Render (Free & Easy)

### 2.1 Sign Up for Render

1. Go to [Render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (easiest option)

### 2.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `Christmastreedesign` repository
4. Configure:
   - **Name**: `christmas-tree-backend`
   - **Root Directory**: `server` ⚠️ **IMPORTANT!**
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
5. Click **"Create Web Service"**

### 2.3 Wait for Deployment

- Render will build and deploy (takes 2-5 minutes)
- You'll see logs in the Render dashboard
- Once done, you'll get a URL like: `https://christmas-tree-backend.onrender.com`

### 2.4 Copy Your Backend URL

**Important:** Copy the full URL (e.g., `https://christmas-tree-backend.onrender.com`)

You'll need this in the next step!

---

## Step 3: Configure Frontend for Production

### 3.1 Add Backend URL to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   
   ⚠️ **Replace** `your-backend-url.onrender.com` with your actual Render URL!
   
5. Click **"Add secret"**

### 3.2 Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages**
2. Under **"Source"**, select:
   - **Source**: `GitHub Actions`
3. Click **"Save"**

---

## Step 4: Deploy Frontend

### 4.1 Push to Trigger Deployment

The GitHub Actions workflow will automatically deploy when you push:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 4.2 Check Deployment Status

1. Go to your repository on GitHub
2. Click **"Actions"** tab
3. You'll see the deployment workflow running
4. Wait for it to complete (green checkmark = success)

### 4.3 Your Site is Live! 🎉

Your site will be available at:
```
https://YOUR_USERNAME.github.io/Christmastreedesign/
```

Replace `YOUR_USERNAME` with your GitHub username (e.g., `gyuryeon.github.io/Christmastreedesign/`)

---

## Step 5: Test Your Live Site

1. Open your GitHub Pages URL
2. Wait for ornaments to load
3. Click an ornament and save a message
4. Refresh - your message should still be there!

---

## Important Notes

### Backend URL Format

Make sure your `VITE_API_URL` secret is:
- ✅ `https://your-backend.onrender.com/api` (with `/api` at the end)
- ❌ NOT `https://your-backend.onrender.com` (missing `/api`)

### Free Tier Limitations

**Render Free Tier:**
- Service may sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (wake up time)
- This is normal and free!

**GitHub Pages:**
- Completely free
- Updates automatically on every push
- Public repositories only

---

## Troubleshooting

### Backend Not Working?

1. Check Render dashboard for errors
2. Check backend logs in Render
3. Verify the URL in GitHub secret is correct

### Frontend Can't Connect?

1. Check browser console (F12) for errors
2. Verify `VITE_API_URL` secret is set correctly
3. Make sure backend URL has `/api` at the end

### GitHub Pages 404?

1. Check repository name matches in `vite.config.ts`
2. Verify GitHub Actions workflow completed successfully
3. Check Pages settings: Source should be "GitHub Actions"

---

## Updating Your Site

To update your live site:

```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

GitHub Actions will automatically rebuild and redeploy! 🚀

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] `VITE_API_URL` secret added to GitHub
- [ ] GitHub Pages enabled
- [ ] Code pushed to trigger deployment
- [ ] Site is live and working!

---

## Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for more details
- Check Render logs if backend isn't working
- Check GitHub Actions logs if frontend isn't deploying

