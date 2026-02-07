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

---

## 📋 Critical Info

- **Mega:** joaquintelleria2@gmail.com
- **GitHub:** KrabbyClaw/krabby-vault
- **Bundle Size:** ~60-70KB

---

*The crab's memory is safe.* 🦀📜
