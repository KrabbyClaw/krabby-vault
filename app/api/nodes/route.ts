import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const graphPath = path.join(process.cwd(), 'systems', 'definitions', 'feeding-graph.json');
    const statePath = path.join(process.cwd(), 'memory', 'node-state.json');
    
    const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    
    // Enhance nodes with current values from state
    const enhancedNodes = graph.nodes.map((node: any) => {
      const enhanced = { ...node };
      
      // Add current value for DATA nodes
      if (node.type === 'DATA' && node.config.path && !node.config.path.startsWith('_')) {
        const pathParts = node.config.path.split('.');
        let value = state.data;
        for (const part of pathParts) {
          value = value?.[part];
        }
        enhanced.currentValue = value;
      }
      
      // Add execution status (mock for now - would be real in production)
      enhanced.lastExecuted = state.lastUpdated;
      
      return enhanced;
    });
    
    return NextResponse.json({
      graph: {
        ...graph,
        nodes: enhancedNodes
      },
      state: {
        lastUpdated: state.lastUpdated,
        version: state.version
      }
    });
  } catch (error) {
    console.error('Node Graph API Error:', error);
    return NextResponse.json({ error: 'Failed to load node graph' }, { status: 500 });
  }
}
