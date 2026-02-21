import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read data files
    const fishTaxPath = path.join(process.cwd(), 'memory', 'fish-tax.json');
    const gamificationPath = path.join(process.cwd(), 'memory', 'gamification.json');
    
    const fishTax = JSON.parse(fs.readFileSync(fishTaxPath, 'utf8'));
    const gamification = JSON.parse(fs.readFileSync(gamificationPath, 'utf8'));
    
    // Create node graph structure for 2D visualization
    const nodeGraph = {
      nodes: [
        // Core system nodes
        { id: 'fish_event', type: 'EVENT', label: 'Fish Tribute', currentValue: fishTax.fishCount },
        { id: 'xp_calc', type: 'LOGIC', label: 'XP Calculator', currentValue: fishTax.xp },
        { id: 'level_check', type: 'LOGIC', label: 'Level Check', currentValue: fishTax.level },
        { id: 'molt_trigger', type: 'EVENT', label: 'Molt Trigger', currentValue: fishTax.moltCycle },
        
        // Data storage nodes
        { id: 'fish_store', type: 'DATA', label: 'Fish Count', currentValue: fishTax.fishCount },
        { id: 'xp_store', type: 'DATA', label: 'Experience', currentValue: fishTax.xp },
        { id: 'level_store', type: 'DATA', label: 'Current Level', currentValue: fishTax.level },
        { id: 'shell_store', type: 'DATA', label: 'Shell Type', currentValue: fishTax.shell },
        
        // Achievement nodes
        { id: 'title_system', type: 'ACHIEVEMENT', label: 'Title System', currentValue: gamification.titles?.length || 0 },
        { id: 'steel_system', type: 'ACHIEVEMENT', label: 'Steel System', currentValue: fishTax.steelShell?.precisionFeedings || 0 },
        { id: 'vault_timer', type: 'CONSTANT', label: 'Vault Timer', currentValue: fishTax.steelShell?.vaultOpensAt },
        
        // Event processors
        { id: 'backup_node', type: 'LOGIC', label: 'Backup Engine', currentValue: 'active' },
        { id: 'webhook_node', type: 'EVENT', label: 'Webhook Trigger', currentValue: 'ready' },
        { id: 'state_sync', type: 'LOGIC', label: 'State Sync', currentValue: 'synced' }
      ],
      
      edges: [
        // Fish → XP → Level flow
        { source: 'fish_event', target: 'xp_calc' },
        { source: 'xp_calc', target: 'level_check' },
        { source: 'level_check', target: 'molt_trigger' },
        
        // Data storage connections
        { source: 'fish_event', target: 'fish_store' },
        { source: 'xp_calc', target: 'xp_store' },
        { source: 'level_check', target: 'level_store' },
        { source: 'molt_trigger', target: 'shell_store' },
        
        // Achievement system connections
        { source: 'fish_store', target: 'title_system' },
        { source: 'xp_store', target: 'title_system' },
        { source: 'level_store', target: 'title_system' },
        { source: 'fish_store', target: 'steel_system' },
        
        // System integrations
        { source: 'fish_event', target: 'backup_node' },
        { source: 'fish_event', target: 'webhook_node' },
        { source: 'xp_calc', target: 'state_sync' },
        { source: 'vault_timer', target: 'webhook_node' },
        { source: 'backup_node', target: 'state_sync' }
      ]
    };

    // Combine all data
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
      
      // Node graph for 2D visualization with complete data
      graph: {
        ...nodeGraph,
        completeData: {
          fish_event: { fishCount: fishTax.fishCount || 0, lastFeed: fishTax.lastFish, status: 'active' },
          xp_calc: { xpPerFish: 100, currentXP: fishTax.xp, formula: 'fishCount * 100' },
          level_check: { currentLevel: fishTax.level, xpMax: fishTax.xpMax, progress: Math.round(((fishTax.xp || 0) / (fishTax.xpMax || 1)) * 100) },
          molt_trigger: { status: 'ready', nextLevel: (fishTax.level || 0) + 1, nextShell: 'Silver' },
          fish_store: { total: fishTax.fishCount || 0, milestones: [5, 10, 25, 50, 100, 200], nextMilestone: 25 - (fishTax.fishCount || 0) },
          xp_store: { current: fishTax.xp || 0, max: fishTax.xpMax || 1, percentage: Math.round(((fishTax.xp || 0) / (fishTax.xpMax || 1)) * 100) },
          level_store: { level: fishTax.level || 0, shell: fishTax.shell || 'Soft', title: 'Iron Forged' },
          shell_store: { current: fishTax.shell || 'Soft', tier: fishTax.level || 0, next: fishTax.level < 10 ? 'Silver' : 'Platinum' },
          title_system: { currentTitle: 'Iron Forged', unlocked: 5, nextTitle: 'Silver Forged' },
          steel_system: {
            energy: fishTax.steelShell?.energy || 0,
            precisionFeedings: fishTax.steelShell?.precisionFeedings || 0,
            assemblyStreak: fishTax.steelShell?.assemblyLine?.currentStreak || 0,
            maxStreak: fishTax.steelShell?.assemblyLine?.maxStreak || 0,
            vaultOpensIn: new Date(fishTax.steelShell?.vaultOpensAt || Date.now()).toLocaleTimeString()
          },
          vault_timer: { nextOpen: fishTax.steelShell?.vaultOpensAt || new Date(Date.now() + 24*60*60*1000).toISOString(), status: 'locked' },
          backup_node: { lastBackup: new Date().toISOString(), count: 12, status: 'active' },
          webhook_node: { active: 2, lastTrigger: '2026-02-19 16:00', status: 'ready' },
          state_sync: { lastSync: new Date().toISOString(), commit: '1335ef3', status: 'synchronized' }
        }
      },
      
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
      },
      
      // Steel Shell Systems
      steelShell: fishTax.steelShell || {
        enabled: false,
        energy: 0,
        precisionFeedings: 0,
        assemblyLine: { currentStreak: 0, maxStreak: 0, lastFeedDate: null },
        vaultOpensAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        precisionWindowMinutes: 60
      },
      
      // Steel Shell Achievements
      steelAchievements: (gamification.titles || [])
        .filter((t: any) => t.steelShell)
        .map((t: any) => {
          let currentProgress = 0;
          const reqType = t.requirement?.type;
          const steelData = fishTax.steelShell;
          
          if (reqType === 'precision_feedings') {
            currentProgress = steelData?.precisionFeedings || 0;
          } else if (reqType === 'assembly_line') {
            currentProgress = steelData?.assemblyLine?.currentStreak || 0;
          } else if (reqType === 'energy_max') {
            currentProgress = steelData?.energy || 0;
          }
          
          return {
            id: t.id,
            name: t.name,
            icon: t.id === 'precision_striker' ? '⚡' :
                  t.id === 'precision_master' ? '🎯' :
                  t.id === 'assembly_worker' ? '🔧' :
                  t.id === 'assembly_foreman' ? '⚙️' :
                  t.id === 'assembly_director' ? '🏭' :
                  t.id === 'high_energy' ? '🔋' : '⚡',
            description: t.description,
            unlocked: t.unlocked || currentProgress >= (t.requirement?.value || 10),
            progress: currentProgress,
            target: t.requirement?.value || 10,
            requirement: reqType
          };
        }),
      
      // System state
      state: {
        lastUpdated: new Date().toISOString(),
        version: "live"
      }
    };
    
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}