#!/bin/bash

# =====================================================
# Complete Automated Multiplayer Deployment
# =====================================================

echo "╔════════════════════════════════════════════╗"
echo "║  🎮 FULL MULTIPLAYER DEPLOYMENT AUTO      ║"
echo "╚════════════════════════════════════════════╝"

echo ""
echo "⏱️  Total Time: ~20 minutes"
echo ""

# Step 1: MongoDB Connection String (already have it)
MONGODB_URI="mongodb+srv://st651102064101_db_user:RRBYEZWyEXsKtPPa@cluster0.ny7w3dh.mongodb.net/?appName=Cluster0"
NETLIFY_URL="tranquil-melba-77872b.netlify.app"

echo "✅ MongoDB URI detected:"
echo "   st651102064101_db_user@cluster0.ny7w3dh.mongodb.net"
echo ""

echo "✅ Netlify Game URL:"
echo "   $NETLIFY_URL"
echo ""

# Save configuration
cat > .env.railway << EOF
PORT=3000
NODE_ENV=production
MONGODB_URI=$MONGODB_URI
CLIENT_ORIGIN=https://$NETLIFY_URL
EOF

cat > DEPLOYMENT_CHECKLIST.md << 'CHECKLIST'
# 🚀 Deployment Checklist

## MongoDB ✅ DONE
- [x] Account created
- [x] Cluster created
- [x] Database user added
- [x] Connection string obtained
- [x] Network access enabled

## Railway (NEXT)
- [ ] Account created
- [ ] GitHub authorized
- [ ] Repository selected
- [ ] Deployment started
- [ ] Status: Success ✅
- [ ] Environment variables added:
  - [ ] PORT = 3000
  - [ ] NODE_ENV = production
  - [ ] MONGODB_URI = (pasted)
  - [ ] CLIENT_ORIGIN = (pasted)
- [ ] Status: Success ✅ (after variables)
- [ ] Server URL copied

## Frontend Update (THEN)
- [ ] Run: bash update_server_url.sh
- [ ] Enter Railway URL
- [ ] Git changes pushed
- [ ] Netlify redeploy finished

## Test Multiplayer (FINAL)
- [ ] Open game in Browser 1
- [ ] Open game in Browser 2
- [ ] Both load successfully
- [ ] See player movement sync
- [ ] Chat works
- [ ] Stats sync

## ✨ Success Indicators
- [ ] No console errors
- [ ] "Connected to server" in console
- [ ] Multiple players visible
- [ ] Real-time sync working
CHECKLIST

echo "════════════════════════════════════════════"
echo "📋 RAILWAY DEPLOYMENT STEPS"
echo "════════════════════════════════════════════"
echo ""

echo "👉 STEP 1: Create Railway Account"
echo "   → Go to: https://railway.app"
echo "   → Click 'Login with GitHub'"
echo "   → Authorize Railway"
echo ""

echo "👉 STEP 2: Create New Project"
echo "   → Click '+ New Project'"
echo "   → Select 'Deploy from GitHub repo'"
echo ""

echo "👉 STEP 3: Select Repository"
echo "   Repository: st651102064101-design/The-game--The-Late-Riser"
echo "   → Search for this repo"
echo "   → Click to select"
echo "   → Click 'Deploy'"
echo ""

echo "👉 STEP 4: Wait for Initial Deploy"
echo "   Status: Building... → Deploying... → Success ✅"
echo "   Time: 2-3 minutes"
echo ""

echo "👉 STEP 5: Add Environment Variables"
echo ""
echo "   In Railway Dashboard:"
echo "   1. Find 'Variables' tab"
echo "   2. Add exactly 4 variables:"
echo ""

cat << 'VARS'
┌─────────────────┬────────────────────────────────────────────────┐
│ Variable        │ Value                                          │
├─────────────────┼────────────────────────────────────────────────┤
│ PORT            │ 3000                                           │
├─────────────────┼────────────────────────────────────────────────┤
│ NODE_ENV        │ production                                     │
├─────────────────┼────────────────────────────────────────────────┤
│ MONGODB_URI     │ mongodb+srv://st651102064101_db_user:         │
│                 │ RRBYEZWyEXsKtPPa@cluster0.ny7w3dh.mongodb.   │
│                 │ net/?appName=Cluster0                         │
├─────────────────┼────────────────────────────────────────────────┤
│ CLIENT_ORIGIN   │ https://tranquil-melba-77872b.netlify.app     │
└─────────────────┴────────────────────────────────────────────────┘
VARS

echo ""
echo "   3. Click 'Save'"
echo "   4. Railway redeploys automatically"
echo "   5. Wait for: Success ✅"
echo ""

echo "👉 STEP 6: Get Railway Server URL"
echo "   → Go to: Deployments tab"
echo "   → Click on successful deployment"
echo "   → Copy 'Railway URL' (looks like: https://rpg-multiplayer-production-xxx.railway.app)"
echo ""

echo "════════════════════════════════════════════"
echo "⏭️  AFTER RAILWAY DEPLOYMENT"
echo "════════════════════════════════════════════"
echo ""

echo "Once Railway shows ✅ Success:"
echo ""
echo "1. Open Terminal"
echo "2. Run:"
echo ""
echo "   bash update_server_url.sh"
echo ""
echo "3. Paste your Railway Server URL when asked"
echo ""
echo "4. Script will:"
echo "   ✓ Update frontend with server URL"
echo "   ✓ Create git commit"
echo "   ✓ Ask to push to GitHub"
echo ""

echo "5. Push to GitHub:"
echo ""
echo "   git push origin main"
echo ""

echo "6. Netlify will redeploy automatically (1-2 min)"
echo ""

echo "════════════════════════════════════════════"
echo "🎮 TEST MULTIPLAYER"
echo "════════════════════════════════════════════"
echo ""

echo "Once Netlify finishes deploying:"
echo ""
echo "1. Open Browser 1: https://tranquil-melba-77872b.netlify.app"
echo "2. Open Browser 2: https://tranquil-melba-77872b.netlify.app"
echo ""
echo "Check:"
echo "   ✅ Both load the game"
echo "   ✅ Players appear on screen"
echo "   ✅ Movement syncs in real-time"
echo "   ✅ No errors in console (F12)"
echo ""

echo "════════════════════════════════════════════"
echo "📊 Configuration Files Ready"
echo "════════════════════════════════════════════"
echo ""

echo "Created:"
echo "  ✅ .env.railway - Environment variables"
echo "  ✅ DEPLOYMENT_CHECKLIST.md - Progress tracker"
echo ""

echo "════════════════════════════════════════════"
echo "✨ SUMMARY"
echo "════════════════════════════════════════════"
echo ""

echo "What you need to do:"
echo ""
echo "1. ✅ MongoDB: COMPLETE ✓"
echo ""
echo "2. ⏳ Railway: (10 minutes)"
echo "   • Create account & deploy repo"
echo "   • Add 4 environment variables"
echo "   • Copy server URL"
echo ""
echo "3. ⏳ Update Frontend: (2 minutes)"
echo "   • Run: bash update_server_url.sh"
echo "   • Enter Railway URL"
echo "   • Git push"
echo ""
echo "4. ⏳ Test: (2 minutes)"
echo "   • Open game in 2 browsers"
echo "   • Check multiplayer works"
echo ""

echo "════════════════════════════════════════════"
echo "⚡ QUICK COPY-PASTE REFERENCE"
echo "════════════════════════════════════════════"
echo ""

echo "MongoDB URI (for Railway MONGODB_URI variable):"
echo "$MONGODB_URI"
echo ""

echo "CLIENT_ORIGIN (for Railway CLIENT_ORIGIN variable):"
echo "https://$NETLIFY_URL"
echo ""

echo "════════════════════════════════════════════"
echo "🎯 Next: Go to railway.app and follow steps!"
echo "════════════════════════════════════════════"
