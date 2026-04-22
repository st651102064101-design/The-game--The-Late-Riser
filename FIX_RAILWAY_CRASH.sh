#!/bin/bash

# =====================================================
# Railway Deployment Troubleshooting
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  🔧 Railway Crash - Quick Fix         ║"
echo "╚════════════════════════════════════════╝"

echo ""
echo "⚠️  Railway deployment shows: CRASHED"
echo ""
echo "Possible causes:"
echo "  1. Missing environment variables"
echo "  2. MongoDB connection error"
echo "  3. package.json issue"
echo ""

echo "════════════════════════════════════════"
echo "✅ Solution:"
echo "════════════════════════════════════════"
echo ""

echo "Step 1: Check Railway Logs"
echo "  → Go to: https://railway.app"
echo "  → Click on project: The-game--The-Late-Riser"
echo "  → Go to: Deployments tab"
echo "  → Click on CRASHED deployment"
echo "  → Scroll down and view the ERROR MESSAGE"
echo ""
echo "Common errors:"
echo "  • 'Cannot find module' → Missing npm install"
echo "  • 'MONGODB_URI undefined' → Environment variable not set"
echo "  • 'Port already in use' → PORT variable issue"
echo ""

echo "Step 2: Fix Environment Variables"
echo "  → Go to: Variables tab"
echo "  → Make sure you have ALL 4 variables:"
echo ""

cat << 'VARS'
┌─────────────────┬───────────────────────┐
│ PORT            │ 3000                  │
│ NODE_ENV        │ production            │
│ MONGODB_URI     │ mongodb+srv://...     │
│ CLIENT_ORIGIN   │ https://tranquil...   │
└─────────────────┴───────────────────────┘
VARS

echo ""

echo "Step 3: Redeploy"
echo "  → Click: Redeploy"
echo "  → Wait for: Success ✅"
echo ""

echo "════════════════════════════════════════"
echo "ถ้ายังไม่ได้: Delete & Redeploy"
echo "════════════════════════════════════════"
echo ""

echo "1. In Railway Dashboard:"
echo "   → Project Settings"
echo "   → Delete Deployment"
echo ""
echo "2. Click: '+ Add Service'"
echo "   → Select: GitHub"
echo "   → Search: st651102064101-design/The-game--The-Late-Riser"
echo "   → Deploy"
echo ""
echo "3. Add Variables again (all 4)"
echo ""
echo "4. Wait for: Success ✅"
echo ""

echo "════════════════════════════════════════"
echo "📋 Then: Get Server URL"
echo "════════════════════════════════════════"
echo ""

echo "Once deployment shows ✅ Success:"
echo ""
echo "1. In Railway, go to: Deployments tab"
echo "2. Look for: Railway URL or Domains section"
echo "3. Copy the URL (e.g., https://rpg-multiplayer-production-xxx.railway.app)"
echo ""
echo "4. Then run in terminal:"
echo ""
echo "   bash update_server_url.sh"
echo ""
echo "5. Paste the URL when asked"
echo ""

echo "════════════════════════════════════════"
echo "ถ้าต้องการความช่วยเหลือ:"
echo "════════════════════════════════════════"
echo ""
echo "Check these:"
echo "  □ Does server/package.json exist?"
echo "  □ Are all 4 environment variables set?"
echo "  □ Is MONGODB_URI correct?"
echo "  □ Is CLIENT_ORIGIN your Netlify domain?"
echo ""
echo "════════════════════════════════════════"
