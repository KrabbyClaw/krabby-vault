/**
 * Node Engine - Core execution system for Krabby Vault
 * 
 * Node Types:
 * - EVENT: Triggers workflow (fish_received, time_tick)
 * - CONSTANT: Static values (100, 24, 60)
 * - DATA: Reads/writes central storage (fish.count, energy.current)
 * - LOGIC: Operations (if, add, compare, and, or)
 * - ACHIEVEMENT: Triggers achievement unlocks
 */

const fs = require('fs');
const path = require('path');

const STATE_PATH = path.join(__dirname, '..', 'memory', 'node-state.json');
const DEFINITIONS_PATH = path.join(__dirname, '..', 'definitions');

class NodeEngine {
  constructor() {
    this.state = this.loadState();
    this.definitions = this.loadDefinitions();
    this.eventQueue = [];
    this.executionLog = [];
  }

  loadState() {
    try {
      return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    } catch (e) {
      return this.createDefaultState();
    }
  }

  createDefaultState() {
    return {
      version: "1.0.0",
      data: {
        fish: { count: 0, lastReceived: null, history: [] },
        vault: { status: "locked", lastOpened: null, nextOpenTime: null, precisionWindowMinutes: 60 },
        crab: { name: "Krabby", shell: "Steel", level: 3, xp: 0, xpMax: 3000, moltCycle: 1 },
        energy: { current: 50, max: 100, lastUpdate: new Date().toISOString() },
        streak: { current: 0, max: 0, lastFeedDate: null, precisionFeedings: 0 },
        achievements: { unlocked: [], pending: [] }
      },
      events: { log: [] }
    };
  }

  loadDefinitions() {
    // Load node type definitions
    return {
      EVENT: {
        description: 'Triggers workflow execution',
        inputs: [],
        outputs: ['trigger'],
        execute: (node, inputs, state) => ({ trigger: true })
      },
      CONSTANT: {
        description: 'Static value',
        inputs: [],
        outputs: ['value'],
        execute: (node, inputs, state) => ({ value: node.config.value })
      },
      DATA: {
        description: 'Read/write central state',
        inputs: ['value', 'trigger'],
        outputs: ['value', 'trigger'],
        execute: (node, inputs, state) => {
          const path = node.config.path.split('.');
          let current = state.data;
          
          // Navigate to parent
          for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]];
          }
          
          const key = path[path.length - 1];
          
          // If value input provided, write
          if (inputs.value !== undefined && node.config.mode !== 'read') {
            if (node.config.operation === 'add') {
              current[key] = (current[key] || 0) + inputs.value;
            } else if (node.config.operation === 'increment') {
              current[key] = (current[key] || 0) + 1;
            } else {
              current[key] = inputs.value;
            }
            state.lastUpdated = new Date().toISOString();
          }
          
          return { value: current[key], trigger: inputs.trigger };
        }
      },
      LOGIC: {
        description: 'Conditional and mathematical operations',
        inputs: ['a', 'b', 'trigger'],
        outputs: ['result', 'true', 'false', 'trigger'],
        execute: (node, inputs, state) => {
          const { operation } = node.config;
          const { a, b, trigger } = inputs;
          
          let result = false;
          
          switch (operation) {
            case 'eq': result = a === b; break;
            case 'gt': result = a > b; break;
            case 'gte': result = a >= b; break;
            case 'lt': result = a < b; break;
            case 'lte': result = a <= b; break;
            case 'add': result = (a || 0) + (b || 0); break;
            case 'subtract': result = (a || 0) - (b || 0); break;
            case 'and': result = a && b; break;
            case 'or': result = a || b; break;
            case 'not': result = !a; break;
            case 'within_minutes':
              // Check if time a is within b minutes of now
              const timeA = new Date(a).getTime();
              const now = Date.now();
              result = (now - timeA) <= (b * 60 * 1000);
              break;
            case 'same_day':
              const d1 = new Date(a);
              const d2 = new Date(b);
              result = d1.toDateString() === d2.toDateString();
              break;
            case 'consecutive_day':
              const day1 = new Date(a);
              const day2 = new Date(b);
              const diff = (day2 - day1) / (1000 * 60 * 60 * 24);
              result = diff === 1;
              break;
          }
          
          return {
            result,
            true: result === true ? trigger : undefined,
            false: result === false ? trigger : undefined,
            trigger
          };
        }
      },
      ACHIEVEMENT: {
        description: 'Unlock achievements',
        inputs: ['trigger'],
        outputs: ['unlocked', 'trigger'],
        execute: (node, inputs, state) => {
          if (!inputs.trigger) return { unlocked: false, trigger: false };
          
          const achievementId = node.config.achievementId;
          const alreadyUnlocked = state.data.achievements.unlocked.includes(achievementId);
          
          if (!alreadyUnlocked) {
            state.data.achievements.unlocked.push(achievementId);
            state.data.achievements.pending.push({
              id: achievementId,
              unlockedAt: new Date().toISOString(),
              name: node.config.name
            });
            return { unlocked: true, trigger: true };
          }
          
          return { unlocked: false, trigger: true };
        }
      }
    };
  }

  getDataValue(path) {
    const parts = path.split('.');
    let current = this.state.data;
    for (const part of parts) {
      if (current === undefined) return undefined;
      current = current[part];
    }
    return current;
  }

  setDataValue(path, value) {
    const parts = path.split('.');
    let current = this.state.data;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    this.state.lastUpdated = new Date().toISOString();
  }

  saveState() {
    fs.writeFileSync(STATE_PATH, JSON.stringify(this.state, null, 2));
  }

  executeNode(node, inputs = {}) {
    const definition = this.definitions[node.type];
    if (!definition) {
      throw new Error(`Unknown node type: ${node.type}`);
    }

    const startTime = Date.now();
    const outputs = definition.execute(node, inputs, this.state);
    const executionTime = Date.now() - startTime;

    this.executionLog.push({
      nodeId: node.id,
      type: node.type,
      inputs,
      outputs,
      executionTime,
      timestamp: new Date().toISOString()
    });

    return outputs;
  }

  executeGraph(graph, eventData = {}) {
    const results = {
      triggered: [],
      modified: [],
      achievements: [],
      log: []
    };

    // Find event nodes
    const eventNodes = graph.nodes.filter(n => n.type === 'EVENT');
    
    for (const eventNode of eventNodes) {
      // Check if this event matches
      if (eventNode.config.event === eventData.type) {
        this.processNodeExecution(eventNode, graph, results, eventData);
      }
    }

    // Save state after execution
    this.saveState();

    return results;
  }

  processNodeExecution(node, graph, results, eventData, visited = new Set()) {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    // Gather inputs from connected nodes
    const inputs = {};
    const incomingEdges = graph.edges.filter(e => e.to === node.id);
    
    for (const edge of incomingEdges) {
      const sourceNode = graph.nodes.find(n => n.id === edge.from);
      if (sourceNode) {
        const sourceOutputs = this.executeNode(sourceNode, {});
        inputs[edge.toPort] = sourceOutputs[edge.fromPort];
      }
    }

    // Add event data if this is the event node
    if (node.type === 'EVENT') {
      Object.assign(inputs, eventData.data);
    }

    // Execute this node
    const outputs = this.executeNode(node, inputs);

    // Track modifications
    if (node.type === 'DATA' && inputs.value !== undefined) {
      results.modified.push({
        path: node.config.path,
        oldValue: this.getDataValue(node.config.path),
        newValue: outputs.value
      });
    }

    // Track achievements
    if (node.type === 'ACHIEVEMENT' && outputs.unlocked) {
      results.achievements.push(node.config.achievementId);
    }

    results.log.push({
      nodeId: node.id,
      type: node.type,
      outputs
    });

    // Process connected nodes
    const outgoingEdges = graph.edges.filter(e => e.from === node.id);
    for (const edge of outgoingEdges) {
      const targetNode = graph.nodes.find(n => n.id === edge.to);
      if (targetNode && outputs[edge.fromPort] !== undefined) {
        this.processNodeExecution(targetNode, graph, results, eventData, visited);
      }
    }
  }

  getState() {
    return this.state;
  }

  getExecutionLog() {
    return this.executionLog;
  }
}

module.exports = { NodeEngine };
