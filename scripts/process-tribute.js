#!/usr/bin/env node
/**
 * Process Fish Tribute
 * Triggered when a fish is fed to the crab
 * 
 * Usage: node scripts/process-tribute.js
 * Or: npm run feed
 */

const { processFeeding } = require('./feeding-system');

console.log('🦀 Processing fish tribute...');

const result = processFeeding();

if (result.success) {
  console.log('✅ Feeding processed successfully');
  console.log(`   Streak: ${result.streak} days`);
  console.log(`   Max Streak: ${result.maxStreak} days`);
  
  if (result.reset) {
    console.log(`   ⚠️  Streak reset: ${result.reason}`);
  } else {
    console.log(`   Status: ${result.reason}`);
  }
  
  process.exit(0);
} else {
  console.error('❌ Feeding processing failed:', result.error);
  process.exit(1);
}
