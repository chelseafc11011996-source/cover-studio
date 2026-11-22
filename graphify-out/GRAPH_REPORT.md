# Graph Report - cover-studio-github  (2026-11-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 43 nodes · 107 edges · 7 communities
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6

## God Nodes (most connected - your core abstractions)
1. `drawBigWave()` - 9 edges
2. `noteName()` - 9 edges
3. `updateSelUI()` - 8 edges
4. `ac()` - 8 edges
5. `toast()` - 8 edges
6. `applyBend()` - 7 edges
7. `renderAdvice()` - 7 edges
8. `buildPiano()` - 6 edges
9. `drawRoll()` - 6 edges
10. `handleFile()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `applyBend()` --calls--> `drawBigWave()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 4_
- `drawBigWave()` --calls--> `drawRoll()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 1_
- `up()` --calls--> `toast()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 5_
- `buildPiano()` --calls--> `ac()`  [EXTRACTED]
  app.js → app.js  _Bridges community 1 → community 3_
- `drawRoll()` --calls--> `selNotes()`  [EXTRACTED]
  app.js → app.js  _Bridges community 1 → community 4_

## Import Cycles
- None detected.

## Communities (7 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.31
Nodes (9): down(), drawBigWave(), makeDemoNS(), move(), nsFmt(), showNS(), toTime(), up() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.36
Nodes (9): buildPiano(), drawContour(), drawRoll(), drawSet(), genRun(), genVar(), noteName(), rootMidi() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.47
Nodes (4): autoCorr(), estimate(), fmt(), transcribe()

### Community 3 - "Community 3"
Cohesion: 0.53
Nodes (6): ac(), freq(), instTone(), playNoteList(), playSeq(), playTone()

### Community 4 - "Community 4"
Cohesion: 0.50
Nodes (4): applyBend(), nsStats(), renderAdvice(), selNotes()

### Community 5 - "Community 5"
Cohesion: 0.50
Nodes (4): addPlan(), renderPlan(), setMode(), toast()

### Community 6 - "Community 6"
Cohesion: 0.67
Nodes (3): drawWave(), handleFile(), setupGraph()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `drawBigWave()` connect `Community 0` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `noteName()` (e.g. with `app.js` and `genRun()`) actually correct?**
  _`noteName()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Why does `applyBend()` connect `Community 4` to `Community 0`, `Community 1`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `noteName()` connect `Community 1` to `Community 0`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._