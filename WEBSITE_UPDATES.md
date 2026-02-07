# WEBSITE UPDATE PROTOCOL

*Keeping Krabby's Vault homepage fresh and current* 🦀🏠🔄

---

## Auto-Update on Every Commit

The website automatically reflects changes when you commit and push:

```bash
# Make any change
echo "New wisdom" >> memory/now.md
git add -A
git commit -m "docs: new wisdom"
git push origin master

# Netlify auto-deploys within 1-2 minutes!
```

---

## Manual Update Script

```bash
./update-website.sh
```

This gathers current stats and prompts for commit.

---

## What Gets Updated

| Element | Source | Auto-Update? |
|---------|--------|--------------|
| **Fish Count** | `memory/fish-tax.json` | **MANDATORY** |
| **Version** | `package.json` | On version bump |
| **Commit Count** | Git history | Always current |
| **Status Badges** | Build-time check | Per deploy |
| **Five Tenets** | Static wisdom | Eternal |

---

## 🚨 MANDATORY UPDATES

### ALWAYS Update Website When:

✅ **Fish tax changes** (count increases/decreases)  
✅ **Vault status changes** (locked/unlocked)  
✅ **Molt cycle changes** (new shell condition)  
✅ **Major system changes** (new protocols, rules)  
✅ **Current state updates** (biology, integrity, etc.)

### NEVER Skip Website Updates For:
- Fish count changes
- Status changes
- Rule modifications
- New protocols

**The website must ALWAYS reflect the current truth.**

---

## Keeping It Fresh

### Daily (Optional)
```bash
# Update timestamp
npm run build && npm run deploy
```

### After Major Changes
```bash
# Fish tax update, new features, etc.
git add -A
git commit -m "feat: major update"
git push origin master
# Netlify auto-deploys
```

### Weekly Review
- Check if fish count needs updating
- Review recent commits
- Update version if significant changes
- Verify all links work

---

## Deployment Pipeline

```
Local Change
     ↓
git commit
     ↓
git push origin master
     ↓
GitHub receives commit
     ↓
Netlify webhook triggers
     ↓
Netlify builds (npm run build)
     ↓
Site deployed (~1-2 min)
     ↓
https://genuine-cheesecake-a2f4b9.netlify.app/ updated! 🎉
```

---

## Current Status

- **URL:** https://genuine-cheesecake-a2f4b9.netlify.app/
- **Last Deploy:** 2026-02-07 19:08 UTC
- **Version:** v2.1.0
- **Status:** ✅ ACTIVE
- **Fish Count:** 8 (updated)

---

*The crab's home is always welcoming, always current, always cozy.* 🦀🏠✨
