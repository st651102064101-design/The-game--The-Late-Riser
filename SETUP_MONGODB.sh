#!/bin/bash

# =====================================================
# MongoDB Atlas Quick Setup Guide
# =====================================================

echo "╔════════════════════════════════════════╗"
echo "║  📊 MongoDB Setup Instructions        ║"
echo "╚════════════════════════════════════════╝"

echo ""
echo "✏️  Step 1: Go to MongoDB Atlas"
echo "   → https://www.mongodb.com/cloud/atlas"
echo ""

echo "✏️  Step 2: Sign Up (if not already)"
echo "   → Use your GitHub account (easiest)"
echo ""

echo "✏️  Step 3: Create Free Cluster"
echo "   → Click 'Create'  or 'Build a Cluster'"
echo "   → Select 'Shared' (Free tier)"
echo "   → Choose region closest to you"
echo "   → Click 'Create Cluster'"
echo ""

echo "✏️  Step 4: Add Database User"
echo "   → Go to 'Database Access'"
echo "   → Click 'Add New Database User'"
echo "   → Username: rpguser"
echo "   → Password: Create strong password"
echo "   → Click 'Add User'"
echo ""

echo "✏️  Step 5: Allow Network Access"
echo "   → Go to 'Network Access'"
echo "   → Click 'Add IP Address'"
echo "   → Select 'Allow Access from Anywhere' (0.0.0.0/0)"
echo "   → Click 'Confirm'"
echo ""

echo "✏️  Step 6: Get Connection String"
echo "   → Go to 'Databases'"
echo "   → Click 'Connect' button"
echo "   → Choose 'Connect your application'"
echo "   → Copy the connection string"
echo "   → Should look like:"
echo "      mongodb+srv://rpguser:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority"
echo ""

echo "✏️  Step 7: Replace PASSWORD"
echo "   → Replace PASSWORD with your database user password"
echo "   → Save this string! You'll need it in Railway"
echo ""

echo "═════════════════════════════════════════"
echo "✅ MongoDB Setup Complete!"
echo "Keep your connection string in a safe place"
echo "═════════════════════════════════════════"
