#!/bin/bash

# =====================================================
# Railway Deployment Automation
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  🚀 Railway Final Setup                ║"
echo "╚════════════════════════════════════════╝"

echo ""
echo "📋 Configuration Summary:"
echo "════════════════════════════════════════"
echo ""

# Your actual config
MONGODB_URI="mongodb+srv://st651102064101_db_user:RRBYEZWyEXsKtPPa@cluster0.ny7w3dh.mongodb.net/?appName=Cluster0"
NETLIFY_URL="tranquil-melba-77872b.netlify.app"
REPO="st651102064101-design/The-game--The-Late-Riser"

echo "✅ MongoDB URI:"
echo "   $MONGODB_URI"
echo ""

echo "✅ Netlify Game URL:"
echo "   https://$NETLIFY_URL"
echo ""

echo "✅ GitHub Repo:"
echo "   $REPO"
echo ""

echo "════════════════════════════════════════"
echo ""

# Save config
cat > RAILWAY_SETUP_INFO.txt << EOF
=== 🚀 RAILWAY DEPLOYMENT INFO ===

MongoDB URI:
$MONGODB_URI

Netlify Frontend:
https://$NETLIFY_URL

GitHub Repository:
$REPO

Setup Date: $(date)

=== NEXT STEPS IN RAILWAY ===

1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Select repo: st651102064101-design/The-game--The-Late-Riser
4. Add these Variables:

   PORT = 3000
   NODE_ENV = production
   MONGODB_URI = $MONGODB_URI
   CLIENT_ORIGIN = https://$NETLIFY_URL

5. Wait for deployment ✅ Success
6. Copy your Railway Server URL
7. Run: bash update_server_url.sh

=== END ===
EOF

echo "📁 Configuration file created: RAILWAY_SETUP_INFO.txt"
echo ""

echo "════════════════════════════════════════"
echo "📋 RAILWAY.APP SETUP INSTRUCTIONS"
echo "════════════════════════════════════════"
echo ""

echo "👉 STEP 1: Go to Railway"
echo "   URL: https://railway.app"
echo ""

echo "👉 STEP 2: Create New Project"
echo "   • Click '+ New Project'"
echo "   • Select 'Deploy from GitHub repo'"
echo "   • Authorize Railway with GitHub"
echo ""

echo "👉 STEP 3: Select Your Repository"
echo "   • Search for: st651102064101-design"
echo "   • Select: The-game--The-Late-Riser"
echo ""

echo "👉 STEP 4: Railway Auto-Detects"
echo "   • It will find package.json in server/"
echo "   • Click 'Deploy'"
echo "   • Status: Building → Deploying → Success ✅"
echo ""

echo "👉 STEP 5: Add Environment Variables"
echo "   • In Railway, go to: Variables tab"
echo "   • Add exactly these 4 variables:"
echo ""

cat << 'VARS'
┌────────────────┬─────────────────────────────────────────┐
│ Variable Name  │ Value                                   │
├────────────────┼─────────────────────────────────────────┤
│ PORT           │ 3000                                    │
│ NODE_ENV       │ production                              │
│ MONGODB_URI    │ mongodb+srv://st651102064101_db_user:.. │
│ CLIENT_ORIGIN  │ https://tranquil-melba-77872b.netlify.. │
└────────────────┴─────────────────────────────────────────┘
VARS

echo ""
echo "   For MONGODB_URI, paste this entire string:"
echo "   $MONGODB_URI"
echo ""

echo "   For CLIENT_ORIGIN, paste:"
echo "   https://$NETLIFY_URL"
echo ""

echo "👉 STEP 6: Save Variables"
echo "   • Railway will redeploy automatically"
echo "   • Wait for status: Success ✅"
echo ""

echo "👉 STEP 7: Get Your Server URL"
echo "   • Go to: Deployments tab"
echo "   • Click on successful deployment"
echo "   • Look for 'Railway URL' or 'Domains'"
echo "   • Copy the URL (e.g., https://rpg-multiplayer-production-xxx.railway.app)"
echo ""

echo "════════════════════════════════════════"
echo "⏭️  AFTER RAILWAY DEPLOYMENT"
echo "════════════════════════════════════════"
echo ""

echo "Once Railway shows ✅ Success and you have Server URL:"
echo ""
echo "Run this command:"
echo ""
echo "  bash update_server_url.sh"
echo ""
echo "Then enter your Railway Server URL when prompted"
echo ""

echo "════════════════════════════════════════"
echo "✨ Summary"
echo "════════════════════════════════════════"
echo ""
echo "What happens next:"
echo "  1. You deploy backend on Railway ✅"
echo "  2. Script updates frontend with server URL ✅"
echo "  3. Git push triggers Netlify redeploy ✅"
echo "  4. Players test multiplayer ✅"
echo ""
echo "Configuration saved: RAILWAY_SETUP_INFO.txt"
echo ""
