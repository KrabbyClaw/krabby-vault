'use client';

import { useState } from 'react';

export default function NodeGraph2D({ data }: { data: any }) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!data) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg">
        <h3 className="text-xl font-bold text-purple-300 mb-4">🦀 Steel Shell Status</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-700 rounded">
            <p className="text-slate-300">Loading steel shell data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-purple-900/20 to-slate-800/40 rounded-2xl border border-purple-700/30">
      <h3 className="text-2xl font-bold text-purple-100 mb-6">🔗 Steel Shell Node System</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Stats */}
        <div className="p-4 bg-slate-900/50 rounded-lg">
          <h4 className="text-lg font-semibold text-cyan-300 mb-3">Current Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Fish Count:</span>
              <span className="text-slate-300 font-bold">{data?.fishCount || 17}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">XP Progress:</span>
              <span className="text-slate-300 font-bold">{data?.xp || 457}/{data?.xpMax || 3000}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shell Level:</span>
              <span className="text-slate-300 font-bold">Level {data?.level || 3} - Steel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Energy:</span>
              <span className="text-slate-300 font-bold">{data?.steelShell?.energy || 75}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Streak:</span>
              <span className="text-slate-300 font-bold">{data?.steelShell?.assemblyLine?.currentStreak || 5}/7 days</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-4 bg-slate-900/50 rounded-lg">
          <h4 className="text-lg font-semibold text-cyan-300 mb-3">Progress to Level 4</h4>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((data?.xp || 457) / (data?.xpMax || 3000)) * 100}%` }}
            />
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {Math.round(((data?.xp || 457) / (data?.xpMax || 3000)) * 100)}% complete
          </p>
        </div>
      </div>

      {/* System Overview */}
      <div className="mt-6 p-4 bg-slate-900/30 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-300 mb-2">🛠️ System Overview</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-2 bg-slate-800/50 rounded">
            <span className="text-slate-400">Node Type</span>
            <span className="text-slate-300 block">Steel Shell (Level 3)</span>
          </div>
          <div className="p-2 bg-slate-800/50 rounded">
            <span className="text-slate-400">Status</span>
            <span className="text-slate-300 block">Operational</span>
          </div>
          <div className="p-2 bg-slate-800/50 rounded">
            <span className="text-slate-400">Next Milestone</span>
            <span className="text-slate-300 block">Level 4 - Silver Shell</span>
          </div>
          <div className="p-2 bg-slate-800/50 rounded">
            <span className="text-slate-400">Energy Level</span>
            <span className="text-slate-300 block">75% - Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}