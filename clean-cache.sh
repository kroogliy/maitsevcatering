#!/bin/bash

# Clean cache script for Next.js development issues
# This script removes all cached files and restarts the development server

echo "🧹 Starting cache cleanup..."

# Remove Next.js build cache
if [ -d ".next" ]; then
    echo "📦 Removing .next directory..."
    rm -rf .next
fi

# Remove node_modules/.cache if exists
if [ -d "node_modules/.cache" ]; then
    echo "📦 Removing node_modules/.cache..."
    rm -rf node_modules/.cache
fi

# Remove any turbo cache
if [ -d ".turbo" ]; then
    echo "📦 Removing .turbo directory..."
    rm -rf .turbo
fi

# Clear npm cache
echo "📦 Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo "✅ Cache cleanup complete!"
echo ""
echo "🚀 Starting development server with clean cache..."
echo "   Running: npm run dev:clean"
echo ""

# Start the dev server with clean cache
npm run dev:clean
