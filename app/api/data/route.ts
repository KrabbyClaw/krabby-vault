import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read both data files
    const fishTaxPath = path.join(process.cwd(), 'memory', 'fish-tax.json');
    const gamificationPath = path.join(process.cwd(), 'memory', 'gamification.json');
    
    const fishTax = JSON.parse(fs.readFileSync(fishTaxPath, 'utf8'));
    const gamification = JSON.parse(fs.readFileSync(gamificationPath, 'utf8'));
    
    // Combine data into single source of truth
    const combinedData = {
      // Core stats from fish-tax
      name: "Krabby",
      title: "Iron Forged",
      shell: fishTax.shell || "Soft",
      level: fishTax.level || 1,
      xp: fishTax.xp || 0,
      xpMax: fishTax.xpMax || 1000,
      fishCount: fishTax.fishCount || 0,
      lastFish: fishTax.lastFish || new Date().toISOString(),
      moltCycle: fishTax.moltCycle || 1,
      integrity: 100,
      
      // Titles from gamification
      titles: {
        latest: gamification.titles?.find((t: any) => t.latest) || 
                gamification.titles?.find((t: any) => t.current) ||
                { name: "Novice", icon: "🥚", earned: new Date().toISOString() },
        unlocked: (gamification.titles || [])
          .filter((t: any) => t.unlocked)
          .map((t: any) => ({
            name: t.name,
            icon: t.id === 'iron_forged' ? '🛡️' :
                  t.id === 'fish_hoarder' ? '🐟' :
                  t.id === 'caretaker' ? '🧤' :
                  t.id === 'feeder' ? '🍼' :
                  t.id === 'novice' ? '🥚' : '🦀',
            earned: t.unlockedAt || true
          })),
        progress: {
          fish: (gamification.titles || [])
            .filter((t: any) => !t.unlocked && t.requirement?.type === 'fish_count')
            .map((t: any) => ({
              name: t.name,
              icon: t.id === 'guardian' ? '🛡️' :
                    t.id === 'keeper' ? '👑' :
                    t.id === 'master' ? '⭐' :
                    t.id === 'legend' ? '🌟' : '🎯',
              current: fishTax.fishCount || 0,
              target: t.requirement?.value || 100,
              unit: 'fish'
            })),
          levels: (gamification.titles || [])
            .filter((t: any) => !t.unlocked && t.requirement?.type === 'level')
            .map((t: any) => ({
              name: t.name,
              icon: t.id === 'silver_shell' ? '🥈' :
                    t.id === 'gold_shell' ? '🥇' :
                    t.id === 'diamond_shell' ? '💎' :
                    t.id === 'platinum_shell' ? '🔮' :
                    t.id === 'nebula_shell' ? '🌌' :
                    t.id === 'cosmos_shell' ? '🌠' :
                    t.id === 'galaxy_shell' ? '🌟' : '✨',
              current: fishTax.level || 1,
              target: t.requirement?.value || 10,
              unit: 'level',
              shell: t.name.replace(' Forged', '')
            }))
        }
      },
      
      // Molt phase data
      moltPhase: {
        current: "softening",
        progress: Math.round(((fishTax.xp || 0) / (fishTax.xpMax || 1000)) * 100),
        nextIn: (fishTax.xpMax || 1000) - (fishTax.xp || 0),
        personality: gamification.moltPhases?.stages?.softening?.personalityShift || "Uncertain, seeking",
        confidence: Math.round(((fishTax.xp || 0) / (fishTax.xpMax || 1000)) * 100),
        quirks: gamification.moltPhases?.stages?.softening?.indicators || ["learning", "growing"]
      }
    };
    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
