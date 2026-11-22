# Graph Report - cover-studio-github  (2026-11-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 80 nodes · 227 edges · 8 communities
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7

## God Nodes (most connected - your core abstractions)
1. `noteName()` - 22 edges
2. `toast()` - 16 edges
3. `updateSelUI()` - 12 edges
4. `ac()` - 12 edges
5. `drawBigWave()` - 11 edges
6. `singTest()` - 10 edges
7. `selNotes()` - 10 edges
8. `onFile()` - 9 edges
9. `renderAdvice()` - 9 edges
10. `applyTranspose()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `autoCorr()` --calls--> `autoCorrFull()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 1_
- `down()` --calls--> `drawBigWave()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 2_
- `estimate()` --calls--> `estimateKey()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 6_
- `onFile()` --calls--> `ac()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 4_
- `estimateKey()` --calls--> `autoCorr()`  [EXTRACTED]
  app.js → app.js  _Bridges community 1 → community 6_

## Import Cycles
- None detected.

## Communities (8 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.18
Nodes (11): autoCorrFull(), down(), drawWave(), estimate(), fmt(), move(), onFile(), setFileProg() (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.20
Nodes (12): autoCorr(), bumpPractice(), capturePitch(), drawCompare(), medianOf(), playNoteList(), practicePlay(), recordUserPitch() (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (11): activeEditList(), afterNoteEdit(), confTxt(), drawBigWave(), makeDemoNS(), needSelNote(), nsFmt(), showNS() (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.26
Nodes (12): buildPiano(), drawContour(), drawRoll(), drawSet(), genRun(), genVar(), live(), noteName() (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.39
Nodes (8): ac(), buildMiniPiano(), fillVoiceSelects(), freq(), instTone(), noteByNote(), playSeq(), playTone()

### Community 5 - "Community 5"
Cohesion: 0.43
Nodes (5): applyBend(), nsStats(), renderAdvice(), renderBreath(), selNotes()

### Community 6 - "Community 6"
Cohesion: 0.40
Nodes (4): addPlan(), estimateKey(), renderPlan(), saveState()

### Community 7 - "Community 7"
Cohesion: 0.80
Nodes (5): applyTranspose(), bestShift(), countOut(), effRange(), updateTransposeUI()

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `noteName()` connect `Community 3` to `Community 0`, `Community 1`, `Community 2`, `Community 4`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `noteName()` (e.g. with `app.js` and `genRun()`) actually correct?**
  _`noteName()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Why does `drawCompare()` connect `Community 1` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `drawBigWave()` connect `Community 2` to `Community 0`, `Community 3`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._