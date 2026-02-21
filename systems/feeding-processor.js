#!/usr/bin/env node
/**
 * Node System Feeding Processor
 * Uses the node graph system for modular, extensible feeding logic
 * 
 * Usage: node systems/feeding-processor.js
 * Or: npm run feed-node
 */

const { NodeEngine } = require('./node-engine');
const fs = require('fs');
const path = require('path');

const GRAPH_PATH = path.join(__dirname, 'definitions', 'feeding-graph.json');

function processFeedingEvent() {
  console.log('🦀 Initializing Node Engine...');
  
  const engine = new NodeEngine();
  const graph = JSON.parse(fs.readFileSync(GRAPH_PATH, 'utf8'));
  
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  // Prepare event data
  const eventData = {
    type: 'fish_received',
    data: {
      timestamp: now.toISOString(),
      date: today,
      _current_date: today
    }
  };
  
  console.log('⚡ Executing node graph...');
  console.log(`   Event: ${eventData.type}`);
  console.log(`   Time: ${eventData.data.timestamp}`);
  
  // Execute the graph
  const results = engine.executeGraph(graph, eventData);
  
  console.log('\n📊 Execution Results:');
  console.log(`   Nodes executed: ${results.log.length}`);
  console.log(`   Data modified: ${results.modified.length}`);
  
  if (results.modified.length > 0) {
    console.log('\n   Modifications:');
    results.modified.forEach(m => {
      console.log(`   • ${m.path}: ${m.oldValue} → ${m.newValue}`);
    });
  }
  
  if (results.achievements.length > 0) {
    console.log('\n🏆 Achievements unlocked:');
    results.achievements.forEach(a => {
      console.log(`   ✓ ${a}`);
    });
  }
  
  // Get current state
  const state = engine.getState();
  console.log('\n📈 Current State:');
  console.log(`   Fish count: ${state.data.fish.count}`);
  console.log(`   Energy: ${state.data.energy.current}%`);
  console.log(`   Streak: ${state.data.streak.current} days`);
  console.log(`   Precision feedings: ${state.data.streak.precisionFeedings}`);
  
  return {
    success: true,
    state: state.data,
    achievements: results.achievements,
    modifications: results.modified
  };
}

// Run if called directly
if (require.main === module) {
  try {
    const result = processFeedingEvent();
    console.log('\n✅ Feeding processed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Feeding processing failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { processFeedingEvent };
