#!/bin/bash
# update-fish-display.sh - Sync fish data to website display
# Automatically updates fish count, XP, and related displays

set -e

FISH_TAX_FILE="memory/fish-tax.json"
GAMIFICATION_FILE="memory/gamification.json"
PAGE_FILE="app/page.tsx"

echo "🦀 Syncing fish display to website..."

# Check required files
if [ ! -f "$FISH_TAX_FILE" ]; then
    echo "❌ $FISH_TAX_FILE not found!"
    exit 1
fi

if [ ! -f "$GAMIFICATION_FILE" ]; then
    echo "❌ $GAMIFICATION_FILE not found!"
    exit 1
fi

# Extract data from fish-tax.json
FISH_COUNT=$(grep -o '"fishCount":[0-9]*' "$FISH_TAX_FILE" | cut -d: -f2)
LAST_FISH=$(grep -o '"lastFish":"[^"]*"' "$FISH_TAX_FILE" | cut -d'"' -f4)

# Extract XP from gamification.json (get first match only for main xp field)
CURRENT_XP=$(grep -m1 '"xp":[0-9]*' "$GAMIFICATION_FILE" | grep -o '[0-9]*' | head -1)
NEXT_LEVEL_XP=$(grep -m1 '"xpToNextLevel":[0-9]*' "$GAMIFICATION_FILE" | grep -o '[0-9]*' | head -1)

if [ -z "$FISH_COUNT" ] || [ -z "$LAST_FISH" ]; then
    echo "❌ Failed to extract data from $FISH_TAX_FILE"
    exit 1
fi

if [ -z "$CURRENT_XP" ]; then
    echo "❌ Failed to extract XP from $GAMIFICATION_FILE"
    exit 1
fi

# Calculate XP percentage
XP_PERCENT=$((CURRENT_XP * 100 / NEXT_LEVEL_XP))

echo "📊 Fish Count: $FISH_COUNT"
echo "📅 Last Fish: $LAST_FISH"
echo "💎 Current XP: $CURRENT_XP / $NEXT_LEVEL_XP ($XP_PERCENT%)"

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

# Update XP display
sed -i "s/[0-9]* \/ 3000/$CURRENT_XP \/ $NEXT_LEVEL_XP/g" "$PAGE_FILE"

# Update progress bar width (find number before % in style)
sed -i "s/style={{ width: '[0-9]*%' }}/style={{ width: '$XP_PERCENT%' }}/g" "$PAGE_FILE"

# Update Guardian progress
sed -i "s/Guardian [0-9]*\/25/Guardian $FISH_COUNT\/25/g" "$PAGE_FILE"

echo "✅ Website display updated!"
echo "   - Fish Count: $FISH_COUNT"
echo "   - XP: $CURRENT_XP / $NEXT_LEVEL_XP ($XP_PERCENT%)"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff $PAGE_FILE"
echo "  2. Commit: git add -A && git commit -m 'feat: update fish display'"
echo "  3. Push: git push origin master"
