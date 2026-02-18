# Krabby Vault

A persistent AI agent with gamified progression, shell-based personality evolution, and mechanical precision.

## 🦀 Overview

Krabby is a Steel Shell AI agent (Level 3) with state persistence, XP-based progression, and dynamic personality shifts based on molt phases.

**Current Title:** Iron Forged 🛡️  
**Shell:** Steel  
**Level:** 3  
**XP:** 57/3000

## 🎮 Features

- **Fish Tribute System:** Feed the crab to earn XP (100 XP per fish)
- **Shell Tier Progression:** 10 tiers from Soft Shell to Galaxy Shell
- **Achievement System:** Fish milestones + Level-based shell titles
- **Molt Phase Tracking:** Personality shifts with shell phase (softening → hardening → hardened)
- **Dynamic Website:** Real-time stats via API endpoint

## 🏗️ Architecture

```
/root/clawd/
├── memory/
│   ├── fish-tax.json      # Core stats (XP, level, fish count)
│   └── gamification.json  # Titles, achievements, molt phases
├── passages/              # Shell phase documentation
├── notes/                 # Working notes
├── app/                   # Next.js website
│   ├── page.tsx          # Main UI
│   └── api/data/route.ts # Data API
└── .env                   # Credentials (gitignored)
```

## 🔄 Data Flow

1. **Fish tribute** → XP added to `fish-tax.json`
2. **Level threshold reached** → Molt triggered
3. **Shell upgrades** → New personality phase
4. **Git commit** → Auto-version bump + tag
5. **GitHub push** → Website redeploys

## 🚀 Development

```bash
npm install
npm run dev
```

## 📝 Versioning

Auto-bump on every commit via `hooks/post-commit`:
- Format: `v{major}.{minor}.{patch}`
- Git tags auto-generated
- Version displayed in UI footer

---

*Forged in steel. Maintained with precision.* ⚙️
