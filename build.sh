#!/bin/bash
# Build script for Netlify

echo "🦀 Starting Krabby Vault build..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build
echo "Building Next.js app..."
npm run build

# Verify output
echo "Verifying build output..."
if [ -f "out/index.html" ]; then
    echo "✅ Build successful - out/index.html exists"
    ls -la out/
else
    echo "❌ Build failed - out/index.html not found"
    exit 1
fi
