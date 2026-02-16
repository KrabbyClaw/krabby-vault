#!/bin/bash
# sync-to-mega.sh - Sync bundles to Mega cloud storage
# NOTE: Requires MEGA_PASSWORD environment variable

set -e

BUNDLE_DIR="$HOME/krabby-vault-backups"
MEGA_REMOTE="mega:krabby-vault-backups"

echo "🦀 Syncing bundles to Mega..."

# Check if rclone is installed
if ! command -v rclone &> /dev/null; then
    echo "❌ rclone not found. Installing..."
    curl https://rclone.org/install.sh | bash
fi

# Check if MEGA_PASSWORD is set
if [ -z "$MEGA_PASSWORD" ]; then
    echo "❌ MEGA_PASSWORD not set!"
    echo "Run: export MEGA_PASSWORD='your_password'"
    exit 1
fi

# Create bundle directory if it doesn't exist
mkdir -p "$BUNDLE_DIR"

# Sync to Mega
if rclone sync "$BUNDLE_DIR" "$MEGA_REMOTE" --progress 2>/dev/null; then
    echo "✅ Mega sync complete"
else
    echo "⚠️ Mega sync failed - will retry on next commit"
    exit 1
fi
