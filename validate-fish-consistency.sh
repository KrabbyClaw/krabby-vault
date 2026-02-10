#!/bin/bash
# validate-fish-consistency.sh - Check if website matches fish-tax.json
# Run this before committing to catch mismatches

set -e

FISH_TAX_FILE="memory/fish-tax.json"
PAGE_FILE="app/page.tsx"

echo "🦀 Validating fish data consistency..."

# Extract data from JSON
JSON_FISH_COUNT=$(grep -o '"fishCount":[0-9]*' "$FISH_TAX_FILE" | cut -d: -f2)
JSON_LAST_FISH=$(grep -o '"lastFish":"[^"]*"' "$FISH_TAX_FILE" | cut -d'"' -f4)

# Extract data from page.tsx
PAGE_FISH_COUNT=$(grep -o 'Fish Count: [0-9]*' "$PAGE_FILE" | head -1 | grep -o '[0-9]*')
PAGE_LAST_FISH=$(grep -o "const lastFish = new Date('[^']*')" "$PAGE_FILE" | grep -o "'[^']*'" | tr -d "'" || echo "NOT_FOUND")

echo ""
echo "📊 Fish Count:"
echo "  JSON: $JSON_FISH_COUNT"
echo "  Page: $PAGE_FISH_COUNT"

echo ""
echo "📅 Last Fish Date:"
echo "  JSON: $JSON_LAST_FISH"
echo "  Page: $PAGE_LAST_FISH"

echo ""

# Validate
ERRORS=0

if [ "$JSON_FISH_COUNT" != "$PAGE_FISH_COUNT" ]; then
    echo "❌ ERROR: Fish count mismatch!"
    echo "   Run: bash update-fish-display.sh"
    ERRORS=$((ERRORS + 1))
fi

if [ "$JSON_LAST_FISH" != "$PAGE_LAST_FISH" ]; then
    echo "❌ ERROR: Last fish date mismatch!"
    echo "   Run: bash update-fish-display.sh"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
    echo "✅ All data consistent!"
    exit 0
else
    echo ""
    echo "⚠️  $ERRORS error(s) found. Fix before committing!"
    exit 1
fi
