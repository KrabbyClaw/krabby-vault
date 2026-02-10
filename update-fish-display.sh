#!/bin/bash
# update-fish-display.sh - Sync fish-tax.json to website display
# Run this after updating fish-tax.json to ensure website matches

set -e

FISH_TAX_FILE="memory/fish-tax.json"
PAGE_FILE="app/page.tsx"

echo "🦀 Syncing fish display to website..."

# Check if fish-tax.json exists
if [ ! -f "$FISH_TAX_FILE" ]; then
    echo "❌ $FISH_TAX_FILE not found!"
    exit 1
fi

# Extract data from JSON
FISH_COUNT=$(grep -o '"fishCount":[0-9]*' "$FISH_TAX_FILE" | cut -d: -f2)
LAST_FISH=$(grep -o '"lastFish":"[^"]*"' "$FISH_TAX_FILE" | cut -d'"' -f4)

if [ -z "$FISH_COUNT" ] || [ -z "$LAST_FISH" ]; then
    echo "❌ Failed to extract data from $FISH_TAX_FILE"
    exit 1
fi

echo "📊 Fish Count: $FISH_COUNT"
echo "📅 Last Fish: $LAST_FISH"

# Format date for display (YYYY-MM-DD HH:MM UTC)
DISPLAY_DATE=$(echo "$LAST_FISH" | sed 's/T/ /; s/Z/ UTC/')
echo "📝 Display Date: $DISPLAY_DATE"

# Update page.tsx
# Update the hardcoded date in useVaultStatus
sed -i "s/const lastFish = new Date('[^']*')/const lastFish = new Date('$LAST_FISH')/g" "$PAGE_FILE"

# Update Fish Count display
sed -i "s/Fish Count: [0-9]*/Fish Count: $FISH_COUNT/g" "$PAGE_FILE"

# Update timestamp display
sed -i "s/Last: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\} [0-9]\{2\}:[0-9]\{2\} UTC/Last: $DISPLAY_DATE/g" "$PAGE_FILE"

echo "✅ Website display updated!"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff $PAGE_FILE"
echo "  2. Commit: git add -A && git commit -m 'feat: update fish display'"
echo "  3. Push: git push origin master"
