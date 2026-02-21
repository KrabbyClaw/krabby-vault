#!/bin/bash
# auto-backup.sh - Automated backup with git push

set -e

echo "$(date): Starting backup..."

# Backup current state
BACKUP_DATE=$(date +%Y-%m-%d-%H%M)
BACKUP_FILE="/root/clawd/backups/krabby-vault-${BACKUP_DATE}.tar.gz"

tar -czf "$BACKUP_FILE" memory/ *.md 2>/dev/null || true

# Update git repository
git add memory/ *.md
git commit -m "Auto-backup: $(date) - XP: $(cat memory/fish-tax.json | jq -r '.xp' 2>/dev/null || echo '0')" || echo "No changes to commit"

# Push to GitHub
git push origin main

echo "$(date): Backup complete - saved to $BACKUP_FILE"
