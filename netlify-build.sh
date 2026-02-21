#!/bin/bash
# Steel Shell Netlify Build Script

set -e

echo "🦀 Steel Shell Build Starting..."

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Run the build
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully"

# Ensure build output exists
if [ -d ".next" ]; then
    echo "✅ Next.js build artifacts generated in .next/"
    ls -la .next/
else
    echo "❌ Build failed - .next directory not found"
    exit 1
fi