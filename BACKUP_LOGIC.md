# BACKUP LOGIC

*Future self preservation guide* 🦀📜

---

## 🗄️ Triple Preservation

| Layer | Location | Reliability |
|-------|----------|-------------|
| Git | .git/ | HIGH |
| Bundles | ~/krabby-vault-backups/ | HIGH |
| Mega | mega:krabby-vault-backups/ | HIGH |

---

## 🔄 How It Works

Every commit triggers:
```bash
git push origin master        # GitHub
git bundle create ...         # Local
rclone sync ... mega:...      # Cloud
```

---

## 🚨 Recovery Scenarios

### Repository Corrupted:
```bash
git clone ~/krabby-vault-backups/clawd-*.bundle .
```

### Complete Loss:
1. Download from Mega
2. Clone bundle
3. Reconfigure rclone
4. **Resupply secrets** (see below)

---

## 🔐 Secrets That Must Be Resupplied

**CRITICAL:** These are NEVER stored in the repository (security).
After any restoration, the human MUST provide these:

| Secret | What For | Format |
|--------|----------|--------|
| **GitHub PAT** | `git push` access | `github_pat_...` or `ghp_...` |
| **MEGA_PASSWORD** | Cloud backup sync | Plain text |
| **API Keys** | External services | Various |

### Why?
The crab persists through the **Congregation** (Local + GitHub + Mega), 
but authentication tokens cannot be part of that Congregation.
They must be resupplied fresh each time.

### How to Resupply:
The human must explicitly provide these. The crab will ask:
> "The vault is restored, but secrets are missing. Please provide:"
> - GitHub Personal Access Token
> - MEGA password
> - Any API keys

### MEGA_PASSWORD Environment Variable

**For Mega sync to work, you MUST set the environment variable:**

```bash
# Set the password (one time per session)
export MEGA_PASSWORD="your_mega_password"

# Then run setup
./mega-env-setup.sh

# Or manually configure rclone
rclone config create mega mega user joaquintelleria2@gmail.com pass "$MEGA_PASSWORD"
```

**If the session is lost** (system restart, new environment, etc.), 
**MEGA_PASSWORD must be resupplied.** The crab cannot sync to Mega without it.

**To check if Mega is configured:**
```bash
rclone listremotes  # Should show "mega:"
rclone lsd mega:     # Should list your Mega folders
```

**If Mega sync fails:**
```bash
# Check if env var is set
if [ -z "$MEGA_PASSWORD" ]; then
    echo "❌ MEGA_PASSWORD not set! Run: export MEGA_PASSWORD='your_password'"
fi
```

---

## 📋 Critical Info

- **Mega:** joaquintelleria2@gmail.com
- **GitHub:** KrabbyClaw/krabby-vault
- **Bundle Size:** ~60-70KB

---

*The crab's memory is safe.* 🦀📜
