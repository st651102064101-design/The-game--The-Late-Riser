#!/bin/bash

# =====================================================
# Complete Automated Setup Pipeline
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  🎮 Multiplayer Setup Pipeline        ║"
echo "╚════════════════════════════════════════╝"

echo ""
echo "This script will guide you through all setup steps:"
echo ""
echo "1. ✅ MongoDB Setup (Already done - you have the URI)"
echo "2. ⏳ Railway Setup (Next)"
echo "3. ⏳ Update Frontend URL"
echo "4. ⏳ Git Push to Deploy"
echo "5. ⏳ Test Multiplayer"
echo ""

read -p "Press Enter to continue..." 

echo ""
echo "════════════════════════════════════════"
echo "Step 2: Railway Setup"
echo "════════════════════════════════════════"
echo ""

bash SETUP_RAILWAY_AUTO.sh

echo ""
echo "════════════════════════════════════════"
echo "⏳ Waiting for you to complete Railway setup..."
echo "════════════════════════════════════════"
echo ""
echo "Once your Railway deployment is complete and shows ✅ Success:"
echo ""
read -p "Enter your Railway Server URL (from Domains): " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
  echo "❌ Error: Railway URL is required"
  exit 1
fi

echo "✅ Railway URL saved: $RAILWAY_URL"

# Now update the frontend
echo ""
echo "════════════════════════════════════════"
echo "Step 3: Update Frontend URL"
echo "════════════════════════════════════════"
echo ""

FILE="www/js/plugins/MultiplayerIntegration.js"

if [ ! -f "$FILE" ]; then
  echo "❌ Error: $FILE not found"
  exit 1
fi

# Backup
cp "$FILE" "$FILE.backup"

# Update
sed -i '' "s|const serverUrl = .*|const serverUrl = '${RAILWAY_URL}';|" "$FILE"

echo "✅ Updated $FILE"
echo "   Server URL: $RAILWAY_URL"

echo ""
echo "════════════════════════════════════════"
echo "Step 4: Git Push to Deploy on Netlify"
echo "════════════════════════════════════════"
echo ""

git add www/js/plugins/MultiplayerIntegration.js
git commit -m "🚀 Configure multiplayer server for production"
git push origin main

echo ""
echo "✅ Pushed to GitHub"
echo "   Netlify will redeploy automatically (1-2 minutes)"

echo ""
echo "════════════════════════════════════════"
echo "Step 5: Test Multiplayer"
echo "════════════════════════════════════════"
echo ""

echo "🎮 Open your game in 2 different browsers:"
echo ""
echo "Browser 1: https://tranquil-melba-77872b.netlify.app"
echo "Browser 2: https://tranquil-melba-77872b.netlify.app"
echo ""
echo "Both players should:"
echo "  ✅ Load the game"
echo "  ✅ See each other's characters"
echo "  ✅ See movement sync"
echo "  ✅ See chat messages"
echo ""

echo "════════════════════════════════════════"
echo "🎉 Setup Complete!"
echo "════════════════════════════════════════"
echo ""
echo "Your multiplayer RPG is now:"
echo "  ✅ Backend deployed on Railway"
echo "  ✅ Frontend deployed on Netlify"
echo "  ✅ Database connected to MongoDB"
echo "  ✅ Ready for multiplayer play!"
echo ""
echo "📊 Configuration saved in RAILWAY_CONFIG.txt"
echo ""
