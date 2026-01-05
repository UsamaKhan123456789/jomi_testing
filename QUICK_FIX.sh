#!/bin/bash
# Quick fix script - Run this to deploy

cd ~/StudioProjects/jomi_testing

echo "📦 Adding files to Git..."
git add .

echo "💾 Committing changes..."
git commit -m "Fix vercel.json configuration for API route"

echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Done! Vercel will auto-deploy in 1-2 minutes."
echo "📱 Test URL: https://jomitestingdeeplink.vercel.app/api/article/test123"

