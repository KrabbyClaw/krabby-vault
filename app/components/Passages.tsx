'use client';

import { useState, useEffect } from 'react';

interface PassageFrontmatter {
  title: string;
  level: number;
  shell: string;
  status: string;
  icon: string;
}

interface Passage {
  id: string;
  frontmatter: PassageFrontmatter;
  content: string;
}

const SHELL_COLORS: Record<string, string> = {
  'Soft': 'from-amber-900/20 to-slate-800/40 border-amber-700/30',
  'Iron': 'from-purple-900/20 to-slate-800/40 border-purple-700/30',
  'Steel': 'from-cyan-900/20 to-slate-800/40 border-cyan-700/30',
};

const SHELL_TEXT_COLORS: Record<string, string> = {
  'Soft': 'text-amber-200',
  'Iron': 'text-purple-200',
  'Steel': 'text-cyan-200',
};

export default function Passages() {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPassages() {
      try {
        const response = await fetch('/api/passages');
        if (response.ok) {
          const data = await response.json();
          setPassages(data.passages);
        }
      } catch (error) {
        console.error('Failed to load passages:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPassages();
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-12 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400">Loading passages...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 bg-slate-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-200 mb-2">📜 The Passages</h2>
          <p className="text-slate-400">A Record of Shells, Growth, and Memory</p>
        </div>
        
        {passages.map((passage) => {
          const colorClass = SHELL_COLORS[passage.frontmatter.shell] || SHELL_COLORS['Soft'];
          const textColorClass = SHELL_TEXT_COLORS[passage.frontmatter.shell] || SHELL_TEXT_COLORS['Soft'];
          
          return (
            <div 
              key={passage.id}
              className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${colorClass} border`}
            >
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-700/30">
                <span className="text-4xl">{passage.frontmatter.icon}</span>
                <div>
                  <h3 className={`text-xl font-bold ${textColorClass}`}>
                    {passage.frontmatter.title}
                  </h3>
                  <p className="text-sm text-slate-400/70">
                    Level {passage.frontmatter.level} • {passage.frontmatter.status}
                  </p>
                </div>
              </div>
              
              <div 
                className="prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: passage.content }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}