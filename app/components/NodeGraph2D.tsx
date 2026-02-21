'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import graphData from '../../systems/definitions/feeding-graph.json';

// Node colors based on type
const NODE_COLORS: Record<string, string> = {
  EVENT: '#f59e0b',      // amber
  DATA: '#10b981',       // emerald
  LOGIC: '#3b82f6',      // blue
  CONSTANT: '#6b7280',   // gray
  ACHIEVEMENT: '#8b5cf6', // purple
};

// SVG Node component
function Node({ 
  x, 
  y, 
  label, 
  type, 
  isActive,
  onClick 
}: { 
  x: number;
  y: number;
  label: string;
  type: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const color = NODE_COLORS[type] || '#6366f1';
  
  return (
    <g 
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      className="transition-all duration-200"
    >
      {/* Node circle */}
      <circle
        r={isActive ? 28 : 24}
        fill={color}
        opacity={isActive ? 0.9 : 0.7}
        stroke={isActive ? '#ffffff' : color}
        strokeWidth={isActive ? 3 : 2}
      />
      
      {/* Type label */}
      <text
        y={-30}
        textAnchor="middle"
        fill={color}
        fontSize={10}
        fontWeight="bold"
      >
        {type}
      </text>
      
      {/* Node label */}
      <text
        y={38}
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize={11}
        fontWeight={isActive ? 'bold' : 'normal'}
      >
        {label.length > 12 ? label.substring(0, 12) + '...' : label}
      </text>
    </g>
  );
}

// SVG Connection line
function Connection({ 
  x1, 
  y1, 
  x2, 
  y2, 
  isActive 
}: { 
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isActive ? '#8b5cf6' : '#475569'}
      strokeWidth={isActive ? 3 : 1.5}
      opacity={isActive ? 0.8 : 0.4}
    />
  );
}

// Main export component
export default function NodeGraph2D() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Pan and zoom state
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mouse/Touch event handlers for panning
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - translateX, y: clientY - translateY });
  }, [translateX, translateY]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (isDragging) {
      setTranslateX(clientX - dragStart.x);
      setTranslateY(clientY - dragStart.y);
    }
  }, [isDragging, dragStart]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).tagName === 'rect') {
      handleStart(e.clientX, e.clientY);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const onMouseUp = () => {
    handleEnd();
  };

  const onMouseLeave = () => {
    handleEnd();
  };

  // Touch events for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  // Zoom with wheel
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 3));
  };

  // Reset view
  const resetView = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  };

  // Parse node positions from graph data
  const nodes = graphData.nodes.map((node: any) => ({
    id: node.id,
    label: node.label,
    type: node.type,
    x: (node.position?.x || 0) * 1.2 + 50,
    y: (node.position?.y || 0) * 1.2 + 50,
  }));

  // Parse edges
  const edges = graphData.edges.map((edge: any) => {
    const fromNode = nodes.find((n: any) => n.id === edge.from);
    const toNode = nodes.find((n: any) => n.id === edge.to);
    return {
      id: `${edge.from}-${edge.to}`,
      x1: fromNode?.x || 0,
      y1: fromNode?.y || 0,
      x2: toNode?.x || 0,
      y2: toNode?.y || 0,
      fromId: edge.from,
      toId: edge.to,
    };
  });

  // Get selected node info
  const selectedNodeInfo = selectedNode 
    ? graphData.nodes.find((n: any) => n.id === selectedNode)
    : null;

  // Count nodes by type
  const nodeCounts: Record<string, number> = {};
  graphData.nodes.forEach((node: any) => {
    nodeCounts[node.type] = (nodeCounts[node.type] || 0) + 1;
  });

  if (!mounted) {
    return (
      <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-700/50">
        <h3 className="text-2xl font-bold text-slate-100 mb-4">🔗 Fish Processor Node Graph</h3>
        <div className="h-[500px] bg-slate-950/50 rounded-xl border border-slate-700/50 flex items-center justify-center">
          <p className="text-slate-400">Loading node graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-700/50">
      <h3 className="text-2xl font-bold text-slate-100 mb-4">🔗 Fish Processor Node Graph</h3>
      <p className="text-slate-400 text-sm mb-4">
        Interactive 2D visualization of the event-driven feeding system. Click nodes to see details.
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div 
            key={type}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50"
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-300">{type}</span>
            <span className="text-xs text-slate-500">({nodeCounts[type] || 0})</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={resetView}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200 transition-colors"
        >
          Reset View
        </button>
        <span className="text-xs text-slate-500 self-center">
          {isDragging ? 'Panning...' : 'Drag to pan • Scroll to zoom'}
        </span>
      </div>

      {/* SVG Graph */}
      <div className="h-[500px] bg-slate-950/50 rounded-xl border border-slate-700/50 overflow-hidden touch-none">
        <svg 
          ref={svgRef}
          viewBox="0 0 900 500" 
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ background: '#020617' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onWheel={onWheel}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Transform group for pan/zoom */}
          <g transform={`translate(${translateX}, ${translateY}) scale(${scale})`}>
            {/* Render connections first (behind nodes) */}
            {edges.map((edge: any) => (
              <Connection
                key={edge.id}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                isActive={selectedNode === edge.fromId || selectedNode === edge.toId}
              />
            ))}

            {/* Render nodes */}
            {nodes.map((node: any) => (
              <Node
                key={node.id}
                x={node.x}
                y={node.y}
                label={node.label}
                type={node.type}
                isActive={selectedNode === node.id}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Node Info Panel */}
      {selectedNodeInfo && (
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: NODE_COLORS[selectedNodeInfo.type] }}
            />
            <h4 className="text-lg font-semibold text-slate-200">{selectedNodeInfo.label}</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
              {selectedNodeInfo.type}
            </span>
          </div>
          <p className="text-sm text-slate-400">
            {selectedNodeInfo.config?.description || selectedNodeInfo.config?.operation || 'System component'}
          </p>
          {selectedNodeInfo.config?.path && (
            <p className="text-xs text-slate-500 mt-1">
              Path: {selectedNodeInfo.config.path}
            </p>
          )}
          {selectedNodeInfo.config?.event && (
            <p className="text-xs text-slate-500 mt-1">
              Event: {selectedNodeInfo.config.event}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="p-3 bg-slate-800/30 rounded-lg text-center">
          <p className="text-2xl font-bold text-slate-200">{graphData.nodes.length}</p>
          <p className="text-xs text-slate-400">Total Nodes</p>
        </div>
        <div className="p-3 bg-slate-800/30 rounded-lg text-center">
          <p className="text-2xl font-bold text-slate-200">{graphData.edges.length}</p>
          <p className="text-xs text-slate-400">Connections</p>
        </div>
        <div className="p-3 bg-slate-800/30 rounded-lg text-center">
          <p className="text-2xl font-bold text-slate-200">{Object.keys(nodeCounts).length}</p>
          <p className="text-xs text-slate-400">Node Types</p>
        </div>
      </div>
    </div>
  );
}