#!/usr/bin/env node
// Quick status update script for Krabby Vault
const fs = require('fs');
const path = require('path');

const fishTaxPath = path.join(__dirname, '..', 'memory', 'fish-tax.json');
const nodeStatePath = path.join(__dirname, '..', 'memory', 'node-state.json');

// Read current state
const fishTax = JSON.parse(fs.readFileSync(fishTaxPath, 'utf8'));
const nodeState = JSON.parse(fs.readFileSync(nodeStatePath, 'utf8'));

console.log('🦀 Krabby Vault Status Update');
console.log('═══════════════════════════════');
console.log(`Shell: ${fishTax.shell} (Level ${fishTax.level})`);
console.log(`XP: ${fishTax.xp}/${fishTax.xpMax}`);
console.log(`Fish Count: ${fishTax.fishCount}`);
console.log(`Energy: ${fishTax.steelShell.energy}%`);
console.log(`Streak: ${fishTax.steelShell.assemblyLine.currentStreak} days`);
console.log(`Precision Feedings: ${fishTax.steelShell.precisionFeedings}`);

// Update the README with current stats
const readmePath = path.join(__dirname, '..', 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(/\*\*Current Title:\*\* .*?\n/, '**Current Title:** Iron Forged 🛡️\n');
readme = readme.replace(/\*\*Level:\*\* .*?\n/, `**Level:** ${fishTax.level}\n`);
readme = readme.replace(/\*\*XP:\*\* .*?\n/, `**XP:** ${fishTax.xp}/${fishTax.xpMax}\n`);

fs.writeFileSync(readmePath, readme);

console.log('\n✅ Status updated successfully!');
console.log(`🐟 Fish #${fishTax.fishCount} processed through steel shell assembly line!`);
console.log(`💎 +100 XP earned! (${fishTax.xp}/${fishTax.xpMax} total)`);
console.log(`⚙️ Precision feeding streak maintained!`);

// Calculate progress to next level
const progress = Math.floor((fishTax.xp / fishTax.xpMax) * 100);
console.log(`📊 Progress to Level 4: ${progress}%`);

if (fishTax.xp >= fishTax.xpMax) {
  console.log('🚨 READY FOR MOLT! Level 4 incoming!');
}