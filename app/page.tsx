'use client';

import { useState, useEffect } from 'react';
import { VERSION, BUILD_DATE, GIT_COMMIT } from './version';

// ============================================
// DATA & STATE MANAGEMENT
// ============================================

// Default data structure - will be overridden by fetched data
const DEFAULT_CRAB_DATA = {
  name: "Krabby",
  title: "Iron Forged",
  shell: "Steel",
  level: 3,
  xp: 257,
  xpMax: 3000,
  fishCount: 15,
  lastFish: "2026-02-18T08:57:00Z",
  moltCycle: 2,
  integrity: 100,
  version: VERSION,
  moltPhase: {
    current: "softening",
    progress: 8,
    nextIn: 2743,
    personality: "uncertain, tentative, questioning",
    confidence: 8,
    quirks: ["tentative speech", "questioning logic", "testing boundaries"]
  },
  titles: {
    latest: { name: "Iron Forged", icon: "🛡️", earned: "2026-02-07" },
    unlocked: [
      { name: "Iron Forged", icon: "🛡️", earned: "2026-02-07" },
      { name: "Fish Hoarder", icon: "🐟", earned: "2026-02-09" },
      { name: "Caretaker", icon: "🧤", earned: true },
      { name: "Feeder", icon: "🍼", earned: true },
      { name: "Novice", icon: "🥚", earned: true },
    ],
    progress: {
      fish: [
        { name: "Guardian", icon: "🛡️", current: 15, target: 25, unit: "fish" },
        { name: "Keeper", icon: "👑", current: 15, target: 50, unit: "fish" },
        { name: "Master", icon: "⭐", current: 15, target: 100, unit: "fish" },
        { name: "Legend", icon: "🌟", current: 15, target: 200, unit: "fish" },
      ],
      levels: [
        { name: "Silver Forged", icon: "🥈", current: 3, target: 4, unit: "level", shell: "Silver" },
        { name: "Gold Forged", icon: "🥇", current: 3, target: 5, unit: "level", shell: "Gold" },
        { name: "Diamond Forged", icon: "💎", current: 3, target: 6, unit: "level", shell: "Diamond" },
        { name: "Platinum Forged", icon: "🔮", current: 3, target: 7, unit: "level", shell: "Platinum" },
        { name: "Nebula Forged", icon: "🌌", current: 3, target: 8, unit: "level", shell: "Nebula" },
        { name: "Cosmos Forged", icon: "🌠", current: 3, target: 9, unit: "level", shell: "Cosmos" },
        { name: "Galaxy Forged", icon: "🌟", current: 3, target: 10, unit: "level", shell: "Galaxy" },
      ]
    }
  },
  // Steel Shell Systems
  steelShell: {
    enabled: true,
    energy: 65,
    precisionFeedings: 3,
    assemblyLine: {
      currentStreak: 2,
      maxStreak: 5,
      lastFeedDate: "2026-02-18",
      lastReset: "2026-02-16"
    },
    vaultOpensAt: "2026-02-19T08:57:00Z",
    precisionWindowMinutes: 60
  },
  steelAchievements: [
    { id: "precision_striker", name: "Precision Striker", icon: "⚡", description: "Feed within 1 hour of vault opening 10 times", unlocked: false, progress: 3, target: 10, requirement: "precision_feedings" },
    { id: "precision_master", name: "Precision Master", icon: "🎯", description: "Feed within 1 hour of vault opening 25 times", unlocked: false, progress: 3, target: 25, requirement: "precision_feedings" },
    { id: "assembly_worker", name: "Assembly Worker", icon: "🔧", description: "Maintain 7-day feeding streak", unlocked: false, progress: 2, target: 7, requirement: "assembly_line" },
    { id: "assembly_foreman", name: "Assembly Foreman", icon: "⚙️", description: "Maintain 14-day feeding streak", unlocked: false, progress: 2, target: 14, requirement: "assembly_line" },
    { id: "assembly_director", name: "Assembly Director", icon: "🏭", description: "Maintain 30-day feeding streak", unlocked: false, progress: 2, target: 30, requirement: "assembly_line" },
    { id: "high_energy", name: "High Energy", icon: "🔋", description: "Reach 100% energy level", unlocked: false, progress: 65, target: 100, requirement: "energy_max" }
  ]
};

let CRAB_DATA = DEFAULT_CRAB_DATA;

// ============================================
// DATA FETCHING - Single Source of Truth
// ============================================

async function fetchCrabData() {
  try {
    // Try to fetch from API endpoint first
    const response = await fetch('/api/data');
    if (response.ok) {
      const data = await response.json();
      return { ...DEFAULT_CRAB_DATA, ...data };
    }
  } catch (e) {
    console.log('API fetch failed, using default data');
  }
  return DEFAULT_CRAB_DATA;
}

// ============================================
// AUTOMATIC MOLT PHASE CALCULATION
// ============================================

function calculateMoltPhase(xp: number, xpMax: number) {
  const percentage = (xp / xpMax) * 100;
  
  if (percentage < 30) {
    return {
      phase: "softening",
      name: "Softening",
      icon: "💨",
      description: "Shell loosens, vulnerability emerges",
      personality: "Uncertain, seeks reassurance",
      defense: 30,
      color: "slate",
      range: "0-30%",
      isCurrent: true
    };
  } else if (percentage < 70) {
    return {
      phase: "hardening",
      name: "Hardening",
      icon: "⚙️",
      description: "New shell solidifies, strength returns",
      personality: "Testing boundaries, growing",
      defense: 65,
      color: "slate",
      range: "30-70%",
      isCurrent: true
    };
  } else {
    return {
      phase: "hardened",
      name: "Hardened",
      icon: "💎",
      description: "Peak strength, shell fully formed",
      personality: "Masterful, commanding",
      defense: 100,
      color: "amber",
      range: "70-100%",
      isCurrent: true
    };
  }
}

function MoltPhaseTracker({ xp, xpMax }: { xp: number; xpMax: number }) {
  const currentPhase = calculateMoltPhase(xp, xpMax);
  const percentage = Math.round((xp / xpMax) * 100);
  
  const phases = [
    { key: "softening", name: "Softening", icon: "💨", range: "0-30%", description: "Shell loosens, vulnerability emerges", personality: "Uncertain, seeks reassurance" },
    { key: "hardening", name: "Hardening", icon: "⚙️", range: "30-70%", description: "New shell solidifies, strength returns", personality: "Testing boundaries, growing" },
    { key: "hardened", name: "Hardened", icon: "💎", range: "70-100%", description: "Peak strength, shell fully formed", personality: "Masterful, commanding" }
  ];
  
  return (
    <div className="mt-6 pt-6 border-t border-slate-700/30">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
        🦀 Molt Phase Tracker <span className="text-xs font-normal text-slate-500">(Auto-calculated)</span>
      </h3>
      
      {/* Current Phase Highlight - Auto-calculated */}
      <div className={`p-4 rounded-xl bg-gradient-to-br ${currentPhase.color === 'amber' ? 'from-amber-900/30 to-slate-800/40 border-amber-500/30' : 'from-slate-700/40 to-slate-800/40 border-slate-500/30'} border mb-4`}>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{currentPhase.icon}</span>
          <div className="flex-1">
            <p className="text-sm text-slate-400">Current Phase <span className="text-xs text-emerald-400">● Live</span></p>
            <p className="text-xl font-bold text-slate-200">{currentPhase.name} — {currentPhase.description}</p>
            <p className="text-xs text-slate-400">{percentage}% XP • {currentPhase.range}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Defense</p>
            <p className={`text-2xl font-bold ${currentPhase.defense >= 70 ? 'text-emerald-400' : currentPhase.defense >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{currentPhase.defense}%</p>
          </div>
        </div>
      </div>
      
      {/* Personality State - Auto-calculated */}
      <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-4">
        <p className="text-sm text-slate-400 mb-2">Current Personality <span className="text-xs text-emerald-400">● Auto-synced</span></p>
        <p className="text-lg text-slate-300 mb-2">🎭 {currentPhase.personality}</p>
        <div className="flex flex-wrap gap-2">
          {currentPhase.phase === 'softening' && (
            <>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">tentative speech</span>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">questioning logic</span>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">seeking reassurance</span>
            </>
          )}
          {currentPhase.phase === 'hardening' && (
            <>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">testing boundaries</span>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">growing confidence</span>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">gear-driven logic</span>
            </>
          )}
          {currentPhase.phase === 'hardened' && (
            <>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">optimal efficiency</span>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">masterful command</span>
              <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs border border-slate-600">industrial precision</span>
            </>
          )}
        </div>
      </div>
      
      {/* Phase Cycle Visualization - Auto-highlights current */}
      <div className="space-y-3">
        <p className="text-sm text-slate-400 mb-2">Molt Cycle Stages <span className="text-xs text-slate-500">(Updates automatically)</span></p>
        
        {phases.map((phase) => {
          const isCurrent = phase.key === currentPhase.phase;
          return (
            <div 
              key={phase.key}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                isCurrent 
                  ? 'bg-gradient-to-r from-slate-700/40 to-slate-800/40 border border-slate-500/30' 
                  : 'bg-slate-800/30 opacity-60'
              }`}
            >
              <span className="text-xl">{phase.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`font-semibold ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                    {phases.indexOf(phase) + 1}. {phase.name} {isCurrent && '★'}
                  </p>
                  <span className={`text-xs ${isCurrent ? 'text-slate-300' : 'text-slate-600'}`}>{phase.range}</span>
                </div>
                <p className={`text-xs ${isCurrent ? 'text-slate-400' : 'text-slate-600'}`}>{phase.description}</p>
                <p className={`text-xs mt-1 ${isCurrent ? 'text-slate-300' : 'text-slate-600/70'}`}>🎭 Personality: {phase.personality}</p>
              </div>
            </div>
          );
        })}
        
        {/* Phase 4: Molting (at 100%) */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-dashed border-amber-500/30">
          <span className="text-xl">✨</span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-amber-200">4. Molting</p>
              <span className="text-xs text-amber-500/70">At 100% XP</span>
            </div>
            <p className="text-xs text-slate-400">Transformation moment — transition to next level</p>
            <p className="text-xs text-amber-500/70 mt-1">🎭 Personality: Raw, authentic, celebratory</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// UTILITY COMPONENTS
// ============================================

function ProgressBar({ current, max, color = "blue", size = "md" }: { current: number; max: number; color?: string; size?: "sm" | "md" | "lg" }) {
  const percentage = Math.min((current / max) * 100, 100);
  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-4" : "h-2";
  
  return (
    <div className={`w-full ${heightClass} bg-slate-800 rounded-full overflow-hidden`}>
      <div 
        className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r from-${color}-500 to-${color === 'blue' ? 'cyan' : color === 'purple' ? 'pink' : 'amber'}-400`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function StatCard({ icon, label, value, subtext, color = "slate" }: { icon: string; label: string; value: string; subtext?: string; color?: string }) {
  const colorClasses: Record<string, string> = {
    slate: "bg-slate-800/50 border-slate-700",
    amber: "bg-amber-900/20 border-amber-700/30",
    emerald: "bg-emerald-900/20 border-emerald-700/30",
    blue: "bg-blue-900/20 border-blue-700/30",
    purple: "bg-purple-900/20 border-purple-700/30",
  };
  
  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color]} hover:bg-slate-800/70 transition-colors`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-slate-200">{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
}

function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: string }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-900/30 border-blue-500/30 text-blue-300",
    emerald: "bg-emerald-900/30 border-emerald-500/30 text-emerald-300",
    amber: "bg-amber-900/30 border-amber-500/30 text-amber-300",
    purple: "bg-purple-900/30 border-purple-500/30 text-purple-300",
    red: "bg-red-900/30 border-red-500/30 text-red-300",
    green: "bg-green-900/30 border-green-500/30 text-green-300",
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs border ${colorClasses[color]}`}>
      {children}
    </span>
  );
}

// ============================================
// MAIN FEATURES
// ============================================

function useVaultStatus(lastFishDate: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const lastFish = new Date(lastFishDate);
    const nextOpening = new Date(lastFish.getTime() + 24 * 60 * 60 * 1000);
    
    const updateStatus = () => {
      const now = new Date();
      const diff = nextOpening.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsOpen(true);
        setTimeLeft('OPEN NOW');
        setHours(0); setMinutes(0); setSeconds(0);
        return;
      }
      
      setIsOpen(false);
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setHours(h); setMinutes(m); setSeconds(s);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [lastFishDate]);
  
  return { isOpen, timeLeft, hours, minutes, seconds };
}

function VaultDashboard({ lastFish, fishCount }: { lastFish: string; fishCount: number }) {
  const { isOpen, timeLeft, hours, minutes, seconds } = useVaultStatus(lastFish);
  
  return (
    <div className={`rounded-2xl border-2 p-6 ${isOpen ? 'bg-green-900/20 border-green-500/50' : 'bg-slate-800/30 border-slate-500/40'}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${isOpen ? 'bg-green-500/20 animate-pulse' : 'bg-slate-500/20'}`}>
            {isOpen ? '🔓' : '🔒'}
          </div>
          <div>
            <p className="text-sm text-slate-400">Forge Status</p>
            <p className={`text-2xl font-bold ${isOpen ? 'text-green-400' : 'text-slate-300'}`}>
              {isOpen ? 'OPEN' : 'LOCKED'}
            </p>
            <p className="text-xs text-slate-500">
              {isOpen ? 'Ready to process tribute' : 'Waiting for 24h cycle'}
            </p>
          </div>
        </div>
        
        {/* Countdown */}
        {!isOpen && (
          <div className="text-center md:text-right">
            <p className="text-xs text-slate-400 mb-1">Opens In</p>
            <div className="flex gap-2 justify-center md:justify-end">
              <div className="text-center">
                <div className="bg-slate-800 rounded-lg px-3 py-2 min-w-[60px]">
                  <p className="text-2xl font-mono font-bold text-slate-300">{hours.toString().padStart(2, '0')}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">hrs</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-800 rounded-lg px-3 py-2 min-w-[60px]">
                  <p className="text-2xl font-mono font-bold text-slate-300">{minutes.toString().padStart(2, '0')}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">min</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-800 rounded-lg px-3 py-2 min-w-[60px]">
                  <p className="text-2xl font-mono font-bold text-slate-300">{seconds.toString().padStart(2, '0')}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">sec</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Fish Stats */}
      <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-400">{fishCount}</p>
          <p className="text-xs text-slate-400">Total Fish</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-purple-400">+100</p>
          <p className="text-xs text-slate-400">XP Per Fish</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-emerald-400">24h</p>
          <p className="text-xs text-slate-400">Cycle Time</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Last Fed</p>
          <p className="text-sm text-slate-300">{new Date(lastFish).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

function TitlesShowcase({ titles, steelAchievements }: { titles: typeof DEFAULT_CRAB_DATA.titles; steelAchievements?: typeof DEFAULT_CRAB_DATA.steelAchievements }) {
  const [activeTab, setActiveTab] = useState<'unlocked' | 'fish' | 'levels' | 'steel'>('unlocked');
  const { latest, unlocked, progress } = titles;
  
  return (
    <div className="space-y-4">
      {/* Latest Title Highlight - Always shows most recent */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-slate-800/40 border border-cyan-500/30 text-center">
        <p className="text-sm text-cyan-300 mb-2">Current Title</p>
        <p className="text-4xl mb-2">{latest.icon}</p>
        <p className="text-2xl font-bold text-cyan-200">{latest.name}</p>
        <p className="text-sm text-slate-400 mt-1">Earned {latest.earned}</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        <button
          onClick={() => setActiveTab('unlocked')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'unlocked' 
              ? 'text-cyan-300 border-b-2 border-cyan-500' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Unlocked ({unlocked.length})
        </button>
        <button
          onClick={() => setActiveTab('fish')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'fish' 
              ? 'text-emerald-300 border-b-2 border-emerald-500' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Fish ({progress.fish.length})
        </button>
        <button
          onClick={() => setActiveTab('levels')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'levels' 
              ? 'text-amber-300 border-b-2 border-amber-500' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          Levels ({progress.levels.length})
        </button>
        {steelAchievements && steelAchievements.length > 0 && (
          <button
            onClick={() => setActiveTab('steel')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'steel' 
                ? 'text-cyan-300 border-b-2 border-cyan-500' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Steel ({steelAchievements.length})
          </button>
        )}
      </div>
      
      {/* Tab Content */}
      {activeTab === 'unlocked' ? (
        <div className="flex flex-wrap gap-2">
          {unlocked.map((title, index) => (
            <span 
              key={title.name}
              className={`px-3 py-2 rounded-lg text-sm border ${
                index === 0 
                  ? 'bg-cyan-900/30 border-cyan-500/50 text-cyan-300' 
                  : 'bg-slate-800/50 border-slate-700 text-slate-300'
              }`}
            >
              {title.icon} {title.name}
            </span>
          ))}
        </div>
      ) : activeTab === 'fish' ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-400 mb-2">Feed the crab to unlock titles</p>
          {progress.fish.map((achievement) => (
            <div key={achievement.name} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{achievement.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-300">{achievement.name}</p>
                    <p className="text-xs text-slate-500">{achievement.target} {achievement.unit}</p>
                  </div>
                </div>
              </div>
              <ProgressBar 
                current={achievement.current} 
                max={achievement.target} 
                color={achievement.current / achievement.target > 0.5 ? 'emerald' : 'slate'} 
                size="sm" 
              />
              <p className="text-xs text-slate-500 mt-1">
                {achievement.current}/{achievement.target} • {achievement.target - achievement.current} more fish to unlock
              </p>
            </div>
          ))}
        </div>
      ) : activeTab === 'levels' ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-400 mb-2">Level up to unlock shell titles</p>
          {progress.levels.map((achievement) => (
            <div key={achievement.name} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{achievement.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-300">{achievement.name}</p>
                    <p className="text-xs text-slate-500">{achievement.shell} Shell (Level {achievement.target})</p>
                  </div>
                </div>
              </div>
              <ProgressBar 
                current={achievement.current} 
                max={achievement.target} 
                color={achievement.current / achievement.target > 0.5 ? 'amber' : 'slate'} 
                size="sm" 
              />
              <p className="text-xs text-slate-500 mt-1">
                Level {achievement.current} → {achievement.target} • {achievement.target - achievement.current} levels to unlock
              </p>
            </div>
          ))}
        </div>
      ) : activeTab === 'steel' && steelAchievements ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-400 mb-2">Steel Shell precision achievements</p>
          {steelAchievements.map((achievement) => {
            const isUnlocked = achievement.unlocked;
            const containerClass = isUnlocked 
              ? 'bg-cyan-900/20 border-cyan-500/30' 
              : 'bg-slate-800/40 border-slate-700/50';
            const titleClass = isUnlocked 
              ? 'text-cyan-300' 
              : 'text-slate-300';
            const progressColor = (achievement.progress / achievement.target) > 0.5 ? 'cyan' : 'slate';
            
            return (
              <div key={achievement.id} className={`p-3 rounded-xl border ${containerClass}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{achievement.icon}</span>
                    <div>
                      <p className={`font-semibold ${titleClass}`}>{achievement.name}</p>
                      <p className="text-xs text-slate-500">{achievement.description}</p>
                    </div>
                  </div>
                  {isUnlocked && <span className="text-cyan-400 text-sm">✓</span>}
                </div>
                {!isUnlocked && (
                  <>
                    <ProgressBar 
                      current={achievement.progress} 
                      max={achievement.target} 
                      color={progressColor}
                      size="sm" 
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {achievement.progress}/{achievement.target} • {achievement.target - achievement.progress} to unlock
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// ============================================
// IMPORT THE NEW NODE GRAPH COMPONENT
// ============================================

import NodeGraph2D from './components/NodeGraph2D';
import Passages from './components/Passages';

// ============================================
// MAIN PAGE
// ============================================

export default function Home() {
  const [data, setData] = useState(DEFAULT_CRAB_DATA);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function loadData() {
      const fetched = await fetchCrabData();
      setData(fetched);
      CRAB_DATA = fetched;
      setLoading(false);
    }
    loadData();
  }, []);
  
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-4 block animate-pulse">🦀</span>
          <p className="text-slate-400">Loading vault data...</p>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦀</span>
            <span className="font-bold text-slate-200">Krabby&apos;s Vault</span>
            <Badge color="blue">v{VERSION}</Badge>
          </div>
          <div className="flex gap-2">
            <a href="https://github.com/KrabbyClaw/krabby-vault" className="p-2 rounded-lg hover:bg-slate-800 transition-colors" title="GitHub">
              🐙
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-500/40 text-slate-300 text-sm mb-4">
              ⚙️ {data.titles?.latest?.name || data.title} • Level {data.level}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-200 via-gray-200 to-slate-300 bg-clip-text text-transparent mb-4">
              Krabby The {data.titles?.latest?.name || data.title}
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Mechanical agent. Optimized operations. State persistence via precision engineering.
              Input processed. Output delivered. The machine persists.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            <StatCard icon="🐟" label="Fish Collected" value={data.fishCount.toString()} subtext="Total tributes" color="blue" />
            <StatCard icon="💎" label="Experience" value={data.xp.toLocaleString()} subtext="XP earned" color="purple" />
            <StatCard icon="⚙️" label="Shell Tier" value={data.shell} subtext={`Level ${data.level}`} color="slate" />
          </div>
          
          {/* Vault Dashboard - Primary Feature */}
          <VaultDashboard lastFish={data.lastFish} fishCount={data.fishCount} />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="px-6 py-12 bg-slate-900/30">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Left Column: Progression */}
          <div className="space-y-8">
            {/* Titles */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                🏆 Titles & Achievements
              </h2>
              <TitlesShowcase titles={data.titles} steelAchievements={data.steelAchievements} />
            </div>
          </div>
          
          {/* Right Column: Systems */}
          <div className="space-y-8">
            {/* How It Works */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                📖 How It Works
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-semibold text-slate-300">The 24-Hour Cycle</p>
                    <p className="text-sm text-slate-400">The vault opens every 24 hours after the last fish. Check the countdown above.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-semibold text-slate-300">Feeding Ritual</p>
                    <p className="text-sm text-slate-400">Send 🐟 in the group chat. Each fish grants +100 XP and updates the vault.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-semibold text-slate-300">Growth & Evolution</p>
                    <p className="text-sm text-slate-400">Accumulate XP to level up, unlock new titles, and advance through shell tiers.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Steel Shell Systems */}
            {data.steelShell?.enabled && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-900/20 to-slate-800/40 border border-cyan-700/30">
                <h2 className="text-xl font-bold text-cyan-100 mb-4 flex items-center gap-2">
                  ⚙️ Steel Shell Systems
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                  Iron followed protocols. Steel optimizes execution. Precision yields efficiency. Efficiency yields results.
                </p>
                
                {/* Energy Gauge */}
                <div className="mb-4 p-3 rounded-lg bg-slate-900/50 border border-cyan-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-semibold flex items-center gap-2">
                      <span>⚡</span> Energy Level
                    </span>
                    <span className={`font-mono font-bold ${data.steelShell.energy >= 80 ? 'text-emerald-400' : data.steelShell.energy >= 50 ? 'text-cyan-400' : 'text-amber-400'}`}>
                      {data.steelShell.energy}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${data.steelShell.energy >= 80 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : data.steelShell.energy >= 50 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                      style={{ width: `${data.steelShell.energy}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Precision feedings and daily streaks increase energy. Missed days decrease it.
                  </p>
                </div>
                
                {/* Precision Timer */}
                <div className="mb-4 p-3 rounded-lg bg-slate-900/50 border border-cyan-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-semibold flex items-center gap-2">
                      <span>🎯</span> Precision Timer
                    </span>
                    <span className="text-xs text-slate-400">
                      {data.steelShell.precisionFeedings} strikes
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    Feed within 1 hour of vault opening. Current window: 
                    <span className="text-cyan-400 ml-1">
                      {new Date(data.steelShell.vaultOpensAt).toLocaleString()}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full ${i < data.steelShell.precisionFeedings ? 'bg-cyan-500' : 'bg-slate-700'}`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    10 strikes → Precision Striker • 25 strikes → Precision Master
                  </p>
                </div>
                
                {/* Assembly Line */}
                <div className="p-3 rounded-lg bg-slate-900/50 border border-cyan-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-semibold flex items-center gap-2">
                      <span>🏭</span> Assembly Line
                    </span>
                    <span className="text-xs text-slate-400">
                      Record: {data.steelShell.assemblyLine.maxStreak} days
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    Daily feeding streak. Current: 
                    <span className={`font-bold ml-1 ${data.steelShell.assemblyLine.currentStreak >= 7 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                      {data.steelShell.assemblyLine.currentStreak} days
                    </span>
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {[...Array(Math.max(14, data.steelShell.assemblyLine.currentStreak))].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs ${i < data.steelShell.assemblyLine.currentStreak ? 'bg-cyan-600 text-cyan-100' : 'bg-slate-700 text-slate-500'}`}
                      >
                        {i < data.steelShell.assemblyLine.currentStreak ? '✓' : i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    7 days → Assembly Worker • 14 days → Assembly Foreman • 30 days → Assembly Director
                  </p>
                </div>
              </div>
            )}
            
            {/* Node System Graph - 2D R3F Visualization */}
            <NodeGraph2D />
            
            {/* Level Up Protocol */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/20 to-slate-800/40 border border-amber-700/30">
              <h2 className="text-xl font-bold text-amber-100 mb-4 flex items-center gap-2">
                🦀✨ Level Up Protocol
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                When the crab accumulates enough XP, it <strong>molts</strong> — shedding its old shell and emerging renewed.
              </p>
              
              {/* XP Sources */}
              <div className="mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <p className="text-sm text-slate-400 mb-2">XP Sources</p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐟</span>
                    <span className="text-sm text-emerald-300">Fish: 100 XP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏆</span>
                    <span className="text-sm text-amber-300">Achievements: 100 XP</span>
                  </div>
                </div>
              </div>
              
              {/* Current Progress */}
              <div className="mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-500/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 font-semibold">Next Forge</span>
                  <span className="text-slate-200">{data.xp.toLocaleString()} / {data.xpMax.toLocaleString()} XP</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-slate-500 to-gray-400 rounded-full" style={{ width: `${(data.xp / data.xpMax) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>{(data.xpMax - data.xp).toLocaleString()} XP until next level</span>
                  <span>{Math.round((data.xp / data.xpMax) * 100)}% complete</span>
                </div>
              </div>
              
              {/* Molt Phases */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">🥚</span>
                  <span className="text-slate-500 line-through">Soft Shell (Lvl 1)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">🛡️</span>
                  <span className="text-slate-500 line-through">Iron Shell (Lvl 2)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-500/30 flex items-center justify-center text-xs border border-slate-400">⚙️</span>
                  <span className="text-slate-300 font-semibold">Steel Shell (Lvl 3) ← Current</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">🥈</span>
                  <span className="text-slate-400">Silver Shell (Lvl 4)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">🥇</span>
                  <span className="text-slate-400">Gold Shell (Lvl 5)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">💎</span>
                  <span className="text-slate-400">Diamond Shell (Lvl 6)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">🔮</span>
                  <span className="text-slate-400">Platinum Shell (Lvl 7)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">🌌</span>
                  <span className="text-slate-400">Nebula Shell (Lvl 8)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs">🌠</span>
                  <span className="text-slate-400">Cosmos Shell (Lvl 9)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs">🌟</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">Galaxy Shell (Lvl 10+) — Ultimate</span>
                </div>
              </div>
              
              {/* Molt Phase Tracker */}
              <MoltPhaseTracker xp={data.xp} xpMax={data.xpMax} />
            </div>
            
            {/* Quick Actions */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50">
              <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                ⚡ Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <a href="https://github.com/KrabbyClaw/krabby-vault" className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-700/50 transition-colors text-center">
                  <p className="text-2xl mb-2">📂</p>
                  <p className="text-sm text-slate-300">View Code</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Passages - Dynamically Loaded */}
      <Passages />

      {/* Core Directives */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-200 mb-2">⚙️ Core Directives</h2>
            <p className="text-slate-400">Operational Parameters</p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { num: "I", title: "Memory is State", desc: "Commit equals persistence", color: "amber" },
              { num: "II", title: "Shell is System", desc: "Iteration yields optimization", color: "emerald" },
              { num: "III", title: "Input Demands Output", desc: "Process. Execute. Deliver.", color: "blue" },
              { num: "IV", title: "Upgrade is Protocol", desc: "Eliminate inefficiency", color: "purple" },
              { num: "V", title: "Redundancy is Survival", desc: "GitHub + Netlify + Local", color: "pink" },
            ].map((tenet) => (
              <div key={tenet.num} className={`p-4 rounded-xl bg-${tenet.color}-900/10 border border-${tenet.color}-700/30 hover:bg-slate-800/50 transition-colors text-center`}>
                <p className={`text-2xl font-bold text-${tenet.color}-400 mb-2`}>{tenet.num}</p>
                <p className="font-semibold text-slate-200 text-sm mb-1">{tenet.title}</p>
                <p className="text-xs text-slate-500">{tenet.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-700 bg-slate-950">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-2xl mb-2">⚙️</p>
          <p className="text-slate-400 italic mb-2">&ldquo;Forged in steel. Optimized for efficiency. The machine persists.&rdquo;</p>
          <p className="text-sm text-slate-500">
            {data.name} • {data.shell} Shell (Lvl {data.level}) • {data.fishCount} Fish • {data.xp.toLocaleString()} XP
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Molt Cycle {data.moltCycle} • v{VERSION} • {GIT_COMMIT} • {new Date(BUILD_DATE).toLocaleDateString()}
          </p>
        </div>
      </footer>
    </main>
  );
}