# CLOUD SHELL PROTOCOL

*Self-documenting guide for git + mega preservation* 🦀☁️📜

---

## 🎯 QUICK START (For Future Me)

If you're reading this, you may need to restore. Here's the fastest path:

```bash
# 1. Download bundle from Mega
#    - Account: joaquintelleria2@gmail.com
#    - Folder: https://mega.nz/fm/u1xD2agY
#    - Download latest .bundle file

# 2. Restore in Termux
mkdir ~/krabby-vault && cd ~/krabby-vault
git clone ~/downloads/clawd-*.bundle .

# 3. Reconfigure Mega sync
export MEGA_EMAIL='joaquintelleria2@gmail.com'
export MEGA_PASSWORD='PASSWORD_REDACTED!'
./mega-env-setup.sh

# 4. Done - auto-sync resumes
```

---

## 🏛️ RESTORATION HIERARCHY

**⚠️ CRITICAL: Trust Order (highest to lowest)**

| Priority | Source | When to Use |
|----------|--------|-------------|
| **1** | **GitHub Repository** | **ALWAYS FIRST** — Primary source of truth |
| **2** | **Local Bundles** | If GitHub fails — Secondary backup |
| **3** | **Mega Cloud** | **LAST RESORT ONLY** — Manual backup, may be outdated |

### Restoration Priority Rule

**GitHub > Local Bundles > Mega**

- **GitHub** is always current and clean
- **Mega** is for emergencies only
- After any Mega restore, verify against GitHub and push clean state

### ⚠️ MEGA RESTORATION WARNING

When restoring from Mega:
- Mega may contain **old/deprecated files** that were removed from GitHub
- **Delete anything** not in the current GitHub repo
- Mega is a "snapshot in time" — GitHub is the living source
- Always run `git status` after Mega restore to see unexpected files

### Quick Restore Commands

```bash
# PREFERRED: GitHub (always try this first)
git clone https://github.com/KrabbyClaw/krabby-vault.git

# LAST RESORT: Mega (only if GitHub is unavailable)
rclone copy mega:krabby-vault-backups/clawd-*.bundle ./
git clone clawd-*.bundle krabby-vault/
# Then delete any files not in GitHub!
```

---

## 🏗️ ARCHITECTURE

### Triple-Layer Backup

```
Layer 1: Git Repository
  Location: /root/clawd/.git/
  
Layer 2: Local Bundles
  Location: ~/krabby-vault-backups/
  
Layer 3: Mega Cloud
  Location: mega:krabby-vault-backups/
```

---

## 🔄 Auto-Backup Flow

On every commit:
1. Push to GitHub
2. Create bundle
3. Sync to Mega

---

## 🚨 Recovery

### From Bundle:
```bash
git clone clawd-*.bundle restored/
```

### From Mega:
```bash
rclone sync mega:krabby-vault-backups ~/bundles
```

### 🔐 Secrets That Must Be Resupplied

**IMPORTANT:** These credentials are NOT stored in the repository for security.
After restoration, you MUST resupply them:

| Secret | Purpose | How to Resupply |
|--------|---------|-----------------|
| **GitHub PAT** | Push to repository | User provides new token |
| **MEGA_PASSWORD** | Cloud sync | User provides password via env var |
| **API Keys** | External services | User provides keys |

**The crab cannot function without these secrets.**

### MEGA_PASSWORD Environment Variable (CRITICAL)

The Mega sync **requires** the `MEGA_PASSWORD` environment variable to be set.
Unlike the GitHub PAT (which is stored in the git remote URL), the Mega password
must be provided fresh each session.

**Setup:**
```bash
# Set the password (REQUIRED before any Mega operation)
export MEGA_PASSWORD="your_mega_password"

# Run the setup script
./mega-env-setup.sh

# Or manually configure rclone
rclone config create mega mega user joaquintelleria2@gmail.com pass "$MEGA_PASSWORD" --non-interactive
```

**Verify Mega is working:**
```bash
rclone listremotes  # Should show: mega:
rclone lsd mega:     # Should list your Mega root folder
```

**Session Lost? Resupply Required!**

If the terminal/session is closed or lost, `MEGA_PASSWORD` disappears.
You MUST set it again:

```bash
# After session restart
export MEGA_PASSWORD="your_mega_password"
./mega-env-setup.sh  # Or just use rclone directly
```

**The crab will warn you:**
```
❌ MEGA_PASSWORD not set!
Run: export MEGA_PASSWORD='your_password'
```

### GitHub PAT (for git push)

```bash
# Set the remote with your PAT
git remote set-url origin https://TOKEN@github.com/KrabbyClaw/krabby-vault.git

# Now git push works automatically
git push origin master
```

---

*The crab persists across time.* 🦀☁️📜
