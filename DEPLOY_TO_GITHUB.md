# Deploy to GitHub Pages - Step by Step Guide

This guide will help you deploy your Christmas Tree app so anyone can access it online!

## Overview

You need to deploy:
1. **Backend** → Free hosting service (Render)
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
3. Repository name: `Transformation-Network-Tree` (or any name you like)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (you already have files)
6. Click **"Create repository"**

### 1.3 Push Your Code

GitHub will show you commands. Run these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/Transformation-Network-Tree.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Deploy Backend to Render + MongoDB Atlas (Free & Persistent!)

### 2.1 Set Up MongoDB Atlas (Free Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a **Free Cluster** (M0 - Shared)
4. Choose a cloud provider and region (closest to you)
5. Click **"Create Cluster"** (takes 3-5 minutes)

### 2.2 Configure MongoDB Atlas

1. **Create Database User:**
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Username: `transformation-tree-user` (or any name)
   - Password: Generate a secure password (save it!)
   - Database User Privileges: **Read and write to any database**
   - Click **"Add User"**

2. **Whitelist IP Address:**
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
   - Or add specific IPs for better security
   - Click **"Confirm"**

3. **Get Connection String:**
   - Go to **Database** → **Connect**
   - Choose **"Connect your application"**
   - Driver: **Node.js**, Version: **5.5 or later**
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - **Replace `<password>`** with your actual database user password
   - **Add database name** at the end: `?retryWrites=true&w=majority` → `transformation-tree?retryWrites=true&w=majority`
   - Final string: `mongodb+srv://username:password@cluster.mongodb.net/transformation-tree?retryWrites=true&w=majority`

### 2.3 Deploy Backend to Render

1. Go to [Render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (easiest option)

### 2.4 Create Web Service on Render

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `Transformation-Network-Tree` repository
4. Configure:
   - **Name**: `transformation-tree-backend`
   - **Root Directory**: `server` ⚠️ **IMPORTANT!**
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free**
5. Click **"Create Web Service"**

### 2.5 Add MongoDB Connection to Render

1. In your Render service, go to **Environment** tab
2. Click **"Add Environment Variable"**
3. Add:
   - **Key**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string (from step 2.2)
4. Click **"Save Changes"**

**Important:** Render will automatically redeploy after adding the environment variable.

### 2.6 Advanced Settings (Optional but Recommended)

1. Go to **Settings** tab
2. **Health Check Path**: `/api/health`
3. **Pre-deployment Commands**: (leave empty)
4. **Autodeploy**: Yes (enabled)
5. **Build Filters**: (leave empty/default)

### 2.7 Wait for Deployment

- Render will build and deploy (takes 2-5 minutes)
- You'll see logs in the Render dashboard
- Check logs to see: `Connected to MongoDB` (confirms database connection)
- Once done, you'll get a URL like: `https://transformation-tree-backend.onrender.com`

### 2.8 Copy Your Backend URL

**Important:** Copy the full URL (e.g., `https://transformation-tree-backend.onrender.com`)

You'll need this in the next step!

### 2.9 Storage Capacity

MongoDB Atlas Free Tier can easily handle:
- ✅ 101 ornaments with 200 words each (~100KB total)
- ✅ 512MB free storage (plenty for your data)
- ✅ Your data will persist permanently in MongoDB
- ✅ No data loss after Render restarts or inactivity

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
https://YOUR_USERNAME.github.io/Transformation-Network-Tree/
```

Replace `YOUR_USERNAME` with your GitHub username (e.g., `gyuryeon.github.io/Transformation-Network-Tree/`)

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

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage (plenty for your ~100KB data)
- ✅ **Persistent storage** - data saved permanently in MongoDB! ✅
- ✅ No data loss even when Render sleeps
- ✅ Free forever (with usage limits)

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
4. Make sure Root Directory is set to `server` in Render settings
5. **Verify MongoDB connection:**
   - Check Render logs for `Connected to MongoDB`
   - Verify `MONGODB_URI` environment variable is set correctly
   - Check MongoDB Atlas Network Access (IP whitelist)
   - Verify database user credentials are correct

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

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created and configured
- [ ] Database user created with password
- [ ] IP address whitelisted (0.0.0.0/0 for Render)
- [ ] Connection string copied and password replaced
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render
- [ ] Root Directory set to `server` in Render
- [ ] **MONGODB_URI environment variable added** to Render
- [ ] Health Check Path set to `/api/health` in Render
- [ ] Backend URL copied from Render
- [ ] `VITE_API_URL` secret added to GitHub
- [ ] GitHub Pages enabled
- [ ] Code pushed to trigger deployment
- [ ] Site is live and working!
- [ ] MongoDB connection verified in logs
- [ ] Data persists after restarts (test by restarting service)

---

## Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for more details
- Check Render logs if backend isn't working
- Check MongoDB Atlas connection if data isn't persisting
- Check GitHub Actions logs if frontend isn't deploying

