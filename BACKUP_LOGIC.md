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

---

## 📋 Critical Info

- **Mega:** joaquintelleria2@gmail.com
- **GitHub:** KrabbyClaw/krabby-vault
- **Bundle Size:** ~60-70KB

---

*The crab's memory is safe.* 🦀📜
