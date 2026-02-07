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
| **MEGA_PASSWORD** | Cloud sync | User provides password |
| **API Keys** | External services | User provides keys |

**The crab cannot function without these secrets.**

**To resupply:**
```bash
# GitHub PAT (for git push)
git remote set-url origin https://TOKEN@github.com/KrabbyClaw/krabby-vault.git

# Mega credentials (for cloud sync)
export MEGA_EMAIL='joaquintelleria2@gmail.com'
export MEGA_PASSWORD='[USER_PROVIDES]'
```

---

*The crab persists across time.* 🦀☁️📜
