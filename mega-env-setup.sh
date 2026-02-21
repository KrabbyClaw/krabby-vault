#!/bin/bash
# mega-env-setup.sh - Configure rclone for Mega
# NOTE: User must provide MEGA_PASSWORD environment variable

set -e

echo "🦀 Setting up Mega sync..."

# Check if MEGA_PASSWORD is provided
if [ -z "$MEGA_PASSWORD" ]; then
    echo "❌ MEGA_PASSWORD environment variable not set!"
    echo "Run: export MEGA_PASSWORD='your_password'"
    exit 1
fi

# Check if rclone config exists
if [ ! -f "$HOME/.config/rclone/rclone.conf" ]; then
    mkdir -p "$HOME/.config/rclone"
fi

# Remove old Mega config if exists
sed -i '/\[mega\]/,/^$/d' "$HOME/.config/rclone/rclone.conf" 2>/dev/null || true

# Add Mega config with obscured password
echo "" >> "$HOME/.config/rclone/rclone.conf"
echo "[mega]" >> "$HOME/.config/rclone/rclone.conf"
echo "type = mega" >> "$HOME/.config/rclone/rclone.conf"
echo "user = joaquintelleria2@gmail.com" >> "$HOME/.config/rclone/rclone.conf"
echo "pass = $(rclone obscure "$MEGA_PASSWORD")" >> "$HOME/.config/rclone/rclone.conf"
echo "" >> "$HOME/.config/rclone/rclone.conf"

echo "✅ Mega config added (password obscured)"

# Make scripts executable
chmod +x sync-to-mega.sh 2>/dev/null || true
chmod +x .husky/post-commit 2>/dev/null || true

echo "🦀 Mega setup complete!"
echo "Test with: rclone listremotes"
echo ""
echo "⚠️  IMPORTANT: Unset password from environment when done:"
echo "   unset MEGA_PASSWORD"
