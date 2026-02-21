#!/bin/bash
# backup-now.sh - Manual backup trigger

echo "🦀 Krabby Vault Backup Protocol"
echo "==============================="

# Show current stats
echo "Current State:"
cat memory/fish-tax.json | jq -r '. | "Level: \(.level), XP: \(.xp)/\(.xpMax), Fish: \(.fishCount), Shell: \(.shell)"' 2>/dev/null || echo "Fresh install"

# Run backup
./auto-backup.sh

echo "✅ Backup protocol complete!"
echo "📁 Local backups: /root/clawd/backups/"
echo "☁️ GitHub repo: https://github.com/KrabbyClaw/krabby-vault"
