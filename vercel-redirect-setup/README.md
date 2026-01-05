# Vercel Deep Link Redirect Setup

This guide will help you deploy a serverless function on Vercel that redirects HTTPS links to your app's custom scheme.

## Step-by-Step Deployment Guide

### Prerequisites
- A Vercel account (free tier works)
- Node.js installed (for local testing, optional)
- Your domain `jomi.com` (or subdomain) connected to Vercel

---

## Step 1: Create the Project Structure

1. **Create a new directory** for your Vercel project (or use existing):
   ```bash
   mkdir jomi-deep-link-redirect
   cd jomi-deep-link-redirect
   ```

2. **Copy the files** from the `vercel-redirect-setup` folder:
   - `api/article/[articleId].js` - The serverless function
   - `vercel.json` - Vercel configuration
   - `package.json` - Dependencies

---

## Step 2: Set Up Vercel Project

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Initialize the project**:
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Set up and deploy? **Yes**
     - Which scope? (Select your account)
     - Link to existing project? **No**
     - Project name? `jomi-deep-link-redirect` (or your choice)
     - Directory? `./` (current directory)
     - Override settings? **No**

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard

1. **Go to** [vercel.com](https://vercel.com) and sign in

2. **Click "Add New Project"**

3. **Import your repository** (if using Git) or:
   - Click "Deploy" without Git
   - Upload the project folder

4. **Configure the project**:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

5. **Click "Deploy"**

---

## Step 3: Configure Domain

1. **Go to your project** on Vercel dashboard

2. **Click "Settings"** → **"Domains"**

3. **Add your domain**:
   - Enter: `jomi.com` (or your domain)
   - Click "Add"

4. **Configure DNS** (if needed):
   - Vercel will show you DNS records to add
   - Add them to your domain registrar
   - Wait for DNS propagation (can take up to 24 hours, usually faster)

5. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - Wait for it to be issued (usually a few minutes)

---

## Step 4: Test the Deployment

1. **Get your deployment URL**:
   - From Vercel dashboard: `https://your-project.vercel.app`
   - Or your custom domain: `https://jomi.com`

2. **Test the redirect**:
   - Open: `https://jomi.com/api/article/test123`
   - On mobile: Should redirect to `jomi://article/test123`
   - On desktop: Should show a web page with "Open in App" button

---

## Step 5: Update App Constants (If Needed)

If you're using a different domain or subdomain, update in your Flutter app:

```dart
// lib/core/constants/app_constants.dart
static const String baseUrl = 'https://jomi.com'; // Your actual domain
```

---

## File Structure

Your Vercel project should look like this:

```
jomi-deep-link-redirect/
├── api/
│   └── article/
│       └── [articleId].js    # Serverless function
├── vercel.json              # Vercel configuration
├── package.json             # Dependencies
└── README.md                # This file
```

---

## How It Works

1. **User shares article** → Gets link: `https://jomi.com/api/article/{id}`

2. **User taps link** → Opens in browser

3. **Serverless function detects**:
   - **Mobile device** → Redirects to `jomi://article/{id}` → Opens app
   - **Desktop** → Shows web page with "Open in App" button

4. **App opens** → Navigates to article detail page

---

## Troubleshooting

### Issue: Redirect not working
- **Check**: Is the domain correctly configured in Vercel?
- **Check**: Are DNS records properly set?
- **Test**: Visit `https://jomi.com/api/article/test` directly

### Issue: App not opening
- **Check**: Is the app installed on the device?
- **Check**: Does AndroidManifest.xml have the intent filter?
- **Test**: Try opening `jomi://article/test` directly in browser

### Issue: SSL certificate not issued
- **Wait**: Can take up to 24 hours (usually faster)
- **Check**: DNS records are correct
- **Check**: Domain is verified in Vercel

---

## Advanced: Using Environment Variables

If you need to customize the redirect behavior, you can use environment variables:

1. **In Vercel Dashboard**:
   - Go to Settings → Environment Variables
   - Add variables like:
     - `APP_SCHEME=jomi`
     - `APP_HOST=article`

2. **Update the function** to use them:
   ```javascript
   const appScheme = process.env.APP_SCHEME || 'jomi';
   const customSchemeUrl = `${appScheme}://article/${articleId}`;
   ```

---

## Cost

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - Unlimited serverless function invocations
  - Perfect for this use case!

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Test the function URL directly
3. Verify DNS configuration
4. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

## Next Steps

After deployment:
1. ✅ Test the redirect on mobile
2. ✅ Share an article from the app
3. ✅ Verify the link opens the app
4. ✅ Test on different devices

Your deep linking is now fully functional! 🎉

