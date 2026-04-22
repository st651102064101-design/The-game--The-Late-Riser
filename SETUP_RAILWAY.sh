#!/bin/bash

# =====================================================
# Railway Deployment Quick Guide
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  🚀 Railway Deployment Instructions   ║"
echo "╚════════════════════════════════════════╝"

echo ""
echo "✏️  Step 1: Go to Railway"
echo "   → https://railway.app"
echo ""

echo "✏️  Step 2: Sign Up with GitHub"
echo "   → Click 'Login with GitHub'"
echo "   → Authorize Railway"
echo ""

echo "✏️  Step 3: Create New Project"
echo "   → Click '+ New Project'"
echo "   → Select 'Deploy from GitHub repo'"
echo "   → Choose your 'st651102064101-design/The-game--The-Late-Riser' repo"
echo ""

echo "✏️  Step 4: Configure Deploy"
echo "   → Railway will auto-detect package.json"
echo "   → Select service 'server' folder if asked"
echo "   → Click 'Deploy'"
echo ""

echo "✏️  Step 5: Set Environment Variables"
echo "   → Go to 'Variables' tab"
echo "   → Add these variables:"
echo ""
echo "   ┌─────────────────────────────────┐"
echo "   │ PORT = 3000                     │"
echo "   │                                 │"
echo "   │ NODE_ENV = production           │"
echo "   │                                 │"
echo "   │ MONGODB_URI = <your MongoDB>    │"
echo "   │ (Paste your MongoDB connection) │"
echo "   │                                 │"
echo "   │ CLIENT_ORIGIN =                 │"
echo "   │ https://your-netlify.netlify.app│"
echo "   └─────────────────────────────────┘"
echo ""

echo "✏️  Step 6: Get Your Server URL"
echo "   → Go to 'Deployments' tab"
echo "   → Wait for status ✅ 'Success'"
echo "   → Click the deployment"
echo "   → Look for 'Railway URL' or in Domains"
echo "   → Should look like: https://rpg-multiplayer-production.railway.app"
echo ""

echo "✏️  Step 7: Copy Server URL"
echo "   → Save this URL!"
echo "   → You'll need it next"
echo ""

echo "═════════════════════════════════════════"
echo "✅ Railway Deployment Complete!"
echo "Keep your Railway URL ready"
echo "═════════════════════════════════════════"
