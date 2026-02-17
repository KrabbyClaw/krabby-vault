#!/bin/bash
# sync-to-mega.sh - Backup memory and state to Mega

set -e

echo "☁️ Starting Mega sync..."

# Check if mega is configured
if [ ! -f ~/.megarc ]; then
    echo "❌ Mega credentials not configured"
    exit 1
fi

# Create backup directory with timestamp
BACKUP_DATE=$(date +%Y-%m-%d-%H%M)
BACKUP_DIR="/Backups/daily/${BACKUP_DATE}"

echo "📦 Creating backup for ${BACKUP_DATE}..."

# Create temp archive
tar -czf /tmp/clawd-backup-${BACKUP_DATE}.tar.gz /root/clawd/memory/ /root/clawd/*.md 2>/dev/null || true

# Upload to Mega
echo "☁️ Uploading to Mega..."
if megals /Backups/ >/dev/null 2>&1; then
    megaput --path "$BACKUP_DIR" /tmp/clawd-backup-${BACKUP_DATE}.tar.gz
    echo "✅ Uploaded to $BACKUP_DIR"
else
    echo "⚠️ Mega login failed. Backup saved locally: /tmp/clawd-backup-${BACKUP_DATE}.tar.gz"
    echo "Please verify Mega account at https://mega.nz"
fi

# Cleanup old backups (keep last 7)
echo "🧹 Cleaning up old backups..."
megarm /Backups/daily/$(date -d '8 days ago' +%Y-%m-%d)* 2>/dev/null || true

echo "✅ Mega sync complete"
