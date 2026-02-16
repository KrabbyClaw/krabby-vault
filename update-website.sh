#!/bin/bash
# update-website.sh - Keep Krabby's Vault website up to date
# Run this to refresh dynamic content before deployment

echo "🦀 Updating Vault website with latest information..."

# Get current stats
FISH_COUNT=$(cat memory/fish-tax.json 2>/dev/null | grep -o '"fishCount":[0-9]*' | cut -d: -f2 || echo "7")
VAULT_STATUS=$(if [ -f memory/fish-tax.json ]; then echo "Active"; else echo "Unknown"; fi)
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
LATEST_COMMIT=$(git log --oneline -1 2>/dev/null | cut -d' ' -f1 || echo "---")

echo "📊 Current Stats:"
echo "  - Fish Count: $FISH_COUNT"
echo "  - Commits: $COMMIT_COUNT"
echo "  - Latest: $LATEST_COMMIT"

# Update timestamp in page
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M UTC")
echo "  - Updated: $TIMESTAMP"

# The page.tsx uses static values that get built at deploy time
# To update dynamic content, rebuild and redeploy

echo ""
echo "✅ Stats gathered. To update website:"
echo "  1. git add -A"
echo "  2. git commit -m 'chore: update vault stats'"
echo "  3. git push origin master"
echo "  4. Netlify auto-deploys!"
