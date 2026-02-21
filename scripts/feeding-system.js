/**
 * Steel Shell Feeding System
 * Automatically calculates streaks and updates fish-tax.json
 * 
 * Trigger this when processing a fish tribute:
 * node scripts/process-feeding.js
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const FISH_TAX_PATH = path.join(PROJECT_ROOT, 'memory', 'fish-tax.json');

/**
 * Check if two dates are consecutive calendar days
 * @param {string} date1 - ISO date string (previous)
 * @param {string} date2 - ISO date string (current)
 * @returns {boolean}
 */
function isConsecutiveDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Reset times to compare dates only
  const day1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const day2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
  
  // Calculate difference in days
  const diffMs = day2 - day1;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  return diffDays === 1;
}

/**
 * Check if two dates are the same calendar day
 * @param {string} date1 - ISO date string
 * @param {string} date2 - ISO date string
 * @returns {boolean}
 */
function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/**
 * Calculate new streak based on last feed date and current feed date
 * @param {number} currentStreak - Current streak count
 * @param {string} lastFeedDate - ISO date of last feed
 * @param {string} newFeedDate - ISO date of new feed
 * @returns {{streak: number, reset: boolean, reason: string}}
 */
function calculateStreak(currentStreak, lastFeedDate, newFeedDate) {
  // Same day - streak unchanged (multiple feedings same day)
  if (isSameDay(lastFeedDate, newFeedDate)) {
    return {
      streak: currentStreak,
      reset: false,
      reason: 'same_day'
    };
  }
  
  // Consecutive day - increment streak
  if (isConsecutiveDay(lastFeedDate, newFeedDate)) {
    return {
      streak: currentStreak + 1,
      reset: false,
      reason: 'consecutive'
    };
  }
  
  // Gap detected - reset streak to 1 (today counts as day 1)
  return {
    streak: 1,
    reset: true,
    reason: 'gap_detected'
  };
}

/**
 * Process a new feeding and update fish-tax.json
 * @param {string} newFeedDate - ISO date string (optional, defaults to now)
 * @returns {object} Update result
 */
function processFeeding(newFeedDate = new Date().toISOString()) {
  try {
    // Read current data
    const data = JSON.parse(fs.readFileSync(FISH_TAX_PATH, 'utf8'));
    
    // Ensure steelShell structure exists
    if (!data.steelShell) {
      data.steelShell = {
        enabled: true,
        energy: 0,
        precisionFeedings: 0,
        assemblyLine: {
          currentStreak: 0,
          maxStreak: 0,
          lastFeedDate: null
        },
        vaultOpensAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        precisionWindowMinutes: 60
      };
    }
    
    const assemblyLine = data.steelShell.assemblyLine;
    const lastFeedDate = assemblyLine.lastFeedDate || data.lastFish;
    
    // Calculate new streak
    const result = calculateStreak(
      assemblyLine.currentStreak || 0,
      lastFeedDate,
      newFeedDate
    );
    
    // Update data
    assemblyLine.currentStreak = result.streak;
    assemblyLine.lastFeedDate = newFeedDate;
    
    // Update max streak if current is higher
    if (result.streak > (assemblyLine.maxStreak || 0)) {
      assemblyLine.maxStreak = result.streak;
    }
    
    // Update vault opens time (24h from now)
    data.steelShell.vaultOpensAt = new Date(
      new Date(newFeedDate).getTime() + 24 * 60 * 60 * 1000
    ).toISOString();
    
    // Write back
    fs.writeFileSync(FISH_TAX_PATH, JSON.stringify(data, null, 2));
    
    return {
      success: true,
      streak: result.streak,
      reset: result.reset,
      reason: result.reason,
      maxStreak: assemblyLine.maxStreak
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check if feeding is within precision window (1 hour of vault opening)
 * @param {string} vaultOpensAt - ISO date when vault opened
 * @param {string} feedTime - ISO date of feeding
 * @param {number} windowMinutes - Window in minutes (default 60)
 * @returns {boolean}
 */
function isPrecisionFeeding(vaultOpensAt, feedTime, windowMinutes = 60) {
  const vaultOpen = new Date(vaultOpensAt).getTime();
  const feed = new Date(feedTime).getTime();
  const diffMs = feed - vaultOpen;
  const diffMinutes = diffMs / (1000 * 60);
  
  // Feeding must be within window after vault opens
  return diffMinutes >= 0 && diffMinutes <= windowMinutes;
}

/**
 * Update energy level based on feeding quality
 * @param {number} currentEnergy - Current energy level
 * @param {boolean} isPrecision - Whether this was a precision feeding
 * @param {boolean} maintainedStreak - Whether streak was maintained
 * @returns {number} New energy level (0-100)
 */
function calculateEnergy(currentEnergy, isPrecision, maintainedStreak) {
  let energyChange = 0;
  
  if (isPrecision) {
    energyChange += 5; // Precision bonus
  }
  
  if (maintainedStreak) {
    energyChange += 3; // Streak maintenance bonus
  }
  
  // Base energy for any feeding
  energyChange += 2;
  
  const newEnergy = Math.min(100, Math.max(0, currentEnergy + energyChange));
  return newEnergy;
}

// Export for use in other modules
module.exports = {
  processFeeding,
  calculateStreak,
  isConsecutiveDay,
  isSameDay,
  isPrecisionFeeding,
  calculateEnergy
};

// Run if called directly
if (require.main === module) {
  const result = processFeeding();
  console.log(JSON.stringify(result, null, 2));
}
