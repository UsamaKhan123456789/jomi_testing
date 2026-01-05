# Deployment Steps - Fix 404 Error

## Current Status
Your files are in the correct location, but you need to commit and push them.

## Step 1: Check What Needs to Be Committed

Run this in your `jomi_testing` folder:
```bash
cd ~/StudioProjects/jomi_testing
git status
```

## Step 2: Add All Files

Make sure all files are added to Git:
```bash
git add api/article/[articleId].js
git add vercel.json
git add package.json
```

Or add everything:
```bash
git add .
```

## Step 3: Commit

```bash
git commit -m "Add deep link redirect API function"
```

## Step 4: Push to GitHub

```bash
git push origin main
```

## Step 5: Wait for Vercel Auto-Deploy

- Vercel will automatically detect the push
- Go to your Vercel dashboard
- Wait for deployment to complete (usually 1-2 minutes)
- Check the deployment logs

## Step 6: Test

After deployment completes:
```
https://jomitestingdeeplink.vercel.app/api/article/test123
```

## If Still Getting 404

### Check 1: Verify Files Are in Git
```bash
git ls-files | grep api
```
Should show: `api/article/[articleId].js`

### Check 2: Check Vercel Deployment Logs
1. Go to Vercel dashboard
2. Click on your project
3. Click on the latest deployment
4. Check "Build Logs" for any errors

### Check 3: Verify File Structure
Your project should have:
```
jomi_testing/
├── api/
│   └── article/
│       └── [articleId].js    ← Must exist
├── vercel.json               ← Must exist
└── package.json              ← Must exist
```

### Check 4: Try Manual Redeploy
1. Go to Vercel dashboard
2. Click "Redeploy" on the latest deployment
3. Or trigger a new deployment

## Quick Fix Command

Run these commands in order:
```bash
cd ~/StudioProjects/jomi_testing
git add .
git commit -m "Add API route for deep links"
git push origin main
```

Then wait 1-2 minutes and test the URL again.

