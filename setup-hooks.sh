#!/bin/bash
# setup-hooks.sh - Install git hooks for automatic versioning

echo "🔧 Installing git hooks..."

# Copy hooks to .git/hooks
cp hooks/post-commit .git/hooks/
cp hooks/commit-msg .git/hooks/
chmod +x .git/hooks/post-commit .git/hooks/commit-msg

echo "✅ Hooks installed!"
echo ""
echo "📋 Hook behaviors:"
echo "  • commit-msg: Warns if commit message doesn't follow conventional format"
echo "  • post-commit: Auto-bumps version and creates git tag"
echo ""
echo "⚠️  Remember to push tags: git push origin master --follow-tags"
