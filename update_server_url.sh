#!/bin/bash

# =====================================================
# Update Server URL Script
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  🔗 Update Server URL                 ║"
echo "╚════════════════════════════════════════╝"

# Ask for server URL
read -p "Enter your Railway Server URL: " SERVER_URL

if [ -z "$SERVER_URL" ]; then
  echo "❌ Error: URL cannot be empty"
  exit 1
fi

# Update MultiplayerIntegration.js
FILE="www/js/plugins/MultiplayerIntegration.js"

if [ ! -f "$FILE" ]; then
  echo "❌ Error: $FILE not found"
  exit 1
fi

# Backup original
cp "$FILE" "$FILE.backup"
echo "✅ Backup created: $FILE.backup"

# Replace URL
OLD_LINE="const serverUrl = window.MULTIPLAYER_SERVER_URL || 'http://localhost:3000';"
NEW_LINE="const serverUrl = '${SERVER_URL}';"

sed -i '' "s|const serverUrl = window.MULTIPLAYER_SERVER_URL || 'http://localhost:3000';|const serverUrl = '${SERVER_URL}';|g" "$FILE"

echo "✅ Updated $FILE with new server URL"
echo "   New URL: $SERVER_URL"

echo ""
echo "═════════════════════════════════════════"
echo "✅ Next: Git Push"
echo "Run these commands:"
echo ""
echo "  git add www/js/plugins/MultiplayerIntegration.js"
echo "  git commit -m 'Update server URL for production'"
echo "  git push origin main"
echo ""
echo "═════════════════════════════════════════"
