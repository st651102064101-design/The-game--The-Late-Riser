#!/bin/bash

# =====================================================
# Railway Automated Setup Script
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  🚀 Railway Setup Assistant           ║"
echo "╚════════════════════════════════════════╝"

echo ""
echo "⚠️  IMPORTANT: This script guides you through Railway setup"
echo "   It cannot automate Railway.app itself (requires web browser)"
echo ""

echo "📝 Step 1: Prepare Your Information"
echo "   ┌─────────────────────────────────┐"
echo "   │ Have ready:                     │"
echo "   │ • MongoDB Connection URI        │"
echo "   │ • GitHub repo URL               │"
echo "   │ • Netlify game URL              │"
echo "   └─────────────────────────────────┘"
echo ""

echo "════════════════════════════════════════"
echo ""

# Get MongoDB URI
echo "🔹 Step 2: Enter MongoDB Connection URI"
read -p "Paste your MongoDB URI (from Atlas): " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
  echo "❌ Error: MongoDB URI is required"
  exit 1
fi

echo "✅ MongoDB URI saved"

# Get Netlify URL
echo ""
echo "🔹 Step 3: Enter Your Netlify Game URL"
read -p "Enter your Netlify domain (e.g., tranquil-melba-77872b.netlify.app): " NETLIFY_URL

if [ -z "$NETLIFY_URL" ]; then
  NETLIFY_URL="tranquil-melba-77872b.netlify.app"
  echo "Using default: $NETLIFY_URL"
fi

echo "✅ Netlify URL: https://$NETLIFY_URL"

# Display Railway setup instructions
echo ""
echo "════════════════════════════════════════"
echo "📋 Now Follow These Steps in Railway:"
echo "════════════════════════════════════════"
echo ""

echo "1️⃣  Go to https://railway.app"
echo "   • Login with GitHub"
echo ""

echo "2️⃣  Create New Project"
echo "   • Click '+ New Project'"
echo "   • Select 'Deploy from GitHub repo'"
echo "   • Choose your repo: st651102064101-design/The-game--The-Late-Riser"
echo ""

echo "3️⃣  Wait for Deploy"
echo "   • Railway will auto-detect the project"
echo "   • It may build automatically"
echo "   • Status will show: Building → Deploying → Success ✅"
echo ""

echo "4️⃣  Set Environment Variables"
echo "   • In Railway Dashboard, find 'Variables' tab"
echo "   • Add these variables:"
echo ""

echo "   ┌──────────────────────────────────┐"
echo "   │ KEY              │ VALUE         │"
echo "   ├──────────────────────────────────┤"
echo "   │ PORT             │ 3000          │"
echo "   │ NODE_ENV         │ production    │"
echo "   │ MONGODB_URI      │ (paste below) │"
echo "   │ CLIENT_ORIGIN    │ (paste below) │"
echo "   └──────────────────────────────────┘"
echo ""

echo "   📌 MONGODB_URI:"
echo "   $MONGODB_URI"
echo ""

echo "   📌 CLIENT_ORIGIN:"
echo "   https://$NETLIFY_URL"
echo ""

echo "5️⃣  Redeploy with New Variables"
echo "   • After adding variables, Railway redeploys automatically"
echo "   • Wait for status: Success ✅"
echo ""

echo "6️⃣  Get Your Server URL"
echo "   • Go to 'Deployments' tab"
echo "   • Click the successful deployment"
echo "   • Look for 'Railway URL' or 'Domains'"
echo "   • Copy this URL - you'll need it next"
echo ""

echo "════════════════════════════════════════"
echo "✅ Save this information:"
echo "════════════════════════════════════════"
echo ""

cat > RAILWAY_CONFIG.txt << EOF
=== RAILWAY SETUP INFORMATION ===

MongoDB URI:
$MONGODB_URI

Netlify URL:
https://$NETLIFY_URL

Environment Variables to add in Railway:
PORT=3000
NODE_ENV=production
MONGODB_URI=$MONGODB_URI
CLIENT_ORIGIN=https://$NETLIFY_URL

Repository:
st651102064101-design/The-game--The-Late-Riser

Deployment Folder:
/server

Status: Waiting for Railway deployment...
EOF

echo "📁 Configuration saved to: RAILWAY_CONFIG.txt"
echo ""

echo "════════════════════════════════════════"
echo "❓ Next Steps:"
echo "════════════════════════════════════════"
echo ""
echo "1. Go to railway.app and complete setup"
echo "2. Get your Railway Server URL"
echo "3. Run the next script to update frontend"
echo ""
echo "Command to update frontend URL:"
echo ""
echo "  bash update_server_url.sh"
echo ""
echo "════════════════════════════════════════"
