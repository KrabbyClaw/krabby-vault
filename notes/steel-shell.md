# Steel Shell Technical Notes

## Implementation Details

### Precision Feeding System
- Vault opens every 24 hours after last fish
- 60-minute precision window after vault opens
- Feeding within window = +5 energy + precision strike
- Feeding outside window = +2 energy (base)

### Energy Mechanics
- Max energy: 100%
- Energy affects: Assembly line efficiency, XP gain multiplier
- Energy loss: 10% per missed day
- Energy gain: Precision feeding (+5%), streak maintenance (+3%)

### Assembly Line Streaks
- Tracked in calendar-day sequences
- 7 days: Assembly Worker achievement
- 14 days: Assembly Foreman achievement  
- 30 days: Assembly Director achievement
- Max streak record: 5 days (current)

### Current Metrics (as of last update)
- Fish Count: 17
- XP: 457/3000 (15.2% to Level 4)
- Energy: 75%
- Precision Strikes: 5/10
- Current Streak: 5 days
- Record Streak: 5 days

## Code Architecture

### Node Graph System
- 25 nodes total
- 5 node types: EVENT, DATA, LOGIC, CONSTANT, ACHIEVEMENT
- Edges define data flow between nodes
- Visualization: SVG with pan/zoom

### State Management
- fish-tax.json: Core XP, level, fish count
- node-state.json: Node graph execution state
- gamification.json: Titles, achievements

### API Endpoints
- /api/data: Returns crab state
- /api/nodes: Returns node graph structure
- /api/passages: Returns passage content (NEW)

## Deployment Notes

### Netlify Configuration
- Build command: npm run build
- Publish directory: .next
- Node version: 18+

### Version Control
- Auto-bump on every commit
- Semantic versioning based on commit type
- Header/footer display current version

## Future Improvements

### Level 4 - Silver Shell
- Requirement: 3000 XP
- Features: ??? (to be designed)
- Estimated fish needed: ~26 more

### Node Graph Enhancements
- Add animation on data flow
- Real-time updates when fed
- Export to PNG/SVG

### Passage System
- Currently loads from markdown files
- Files cached at build time
- Future: hot-reload in dev mode