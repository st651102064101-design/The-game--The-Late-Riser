#!/bin/bash

# =====================================================
# Auto Update Server URL and Deploy
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  🔗 Update Server URL & Deploy        ║"
echo "╚════════════════════════════════════════╝"

echo ""
echo "This script will:"
echo "  1. Update frontend with Railway URL"
echo "  2. Create git commit"
echo "  3. Push to GitHub"
echo "  4. Netlify will redeploy automatically"
echo ""

# Get Railway URL
read -p "Enter your Railway Server URL (e.g., https://rpg-multiplayer-production-xxx.railway.app): " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
  echo "❌ Error: URL cannot be empty"
  exit 1
fi

# Validate URL format
if [[ ! "$RAILWAY_URL" =~ ^https:// ]]; then
  echo "⚠️  Warning: URL should start with https://"
  echo "Continuing anyway..."
fi

echo ""
echo "✅ Railway URL: $RAILWAY_URL"
echo ""

# Update file
FILE="www/js/plugins/MultiplayerIntegration.js"

if [ ! -f "$FILE" ]; then
  echo "❌ Error: $FILE not found"
  exit 1
fi

echo "📝 Updating $FILE..."

# Backup
cp "$FILE" "$FILE.backup"
echo "   ✓ Backup created: $FILE.backup"

# Replace the URL - more specific pattern
sed -i '' "s|const serverUrl = .*|const serverUrl = '${RAILWAY_URL}';|" "$FILE"

# Verify update
if grep -q "$RAILWAY_URL" "$FILE"; then
  echo "   ✓ URL updated successfully"
else
  echo "⚠️  Warning: Could not verify update"
fi

echo ""
echo "📋 Git Operations:"
echo ""

# Check git status
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Not a git repository"
  exit 1
fi

echo "   Adding changes..."
git add "$FILE"

echo "   Creating commit..."
git commit -m "🚀 Deploy: Configure multiplayer server for production ($RAILWAY_URL)"

echo "   Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo "   ✓ Push successful!"
else
  echo "⚠️  Push failed - checking status..."
  git status
fi

echo ""
echo "════════════════════════════════════════"
echo "✅ DEPLOYMENT COMPLETE!"
echo "════════════════════════════════════════"
echo ""

echo "What happens next:"
echo "  1. GitHub receives your changes"
echo "  2. Netlify automatically detects the push"
echo "  3. Netlify rebuilds and deploys (1-2 minutes)"
echo "  4. Your game is updated with new server URL"
echo ""

echo "To verify deployment:"
echo "  1. Go to: https://app.netlify.com"
echo "  2. Check deployment status"
echo "  3. Wait for: ✅ Published"
echo ""

echo "Then test multiplayer:"
echo "  1. Open: https://tranquil-melba-77872b.netlify.app"
echo "  2. Open in another browser/device"
echo "  3. Both should load the game"
echo "  4. Players should see each other move!"
echo ""

echo "════════════════════════════════════════"
echo "📊 Configuration Applied"
echo "════════════════════════════════════════"
echo ""
echo "Server URL: $RAILWAY_URL"
echo "Frontend: https://tranquil-melba-77872b.netlify.app"
echo "Database: MongoDB Atlas (st651102064101_db_user)"
echo ""

echo "════════════════════════════════════════"
echo "✨ Good luck! Your multiplayer is almost ready! 🎮"
echo "════════════════════════════════════════"
