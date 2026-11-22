#!/usr/bin/env python3
"""Build a deterministic feature graph for Cover Studio. No LLM, no API key.

Sources (all EXTRACTED, never invented):
  - code/app.js  : function definitions + CALLS between them (regex on bodies),
                   TECHS (8 lab techniques), SCALES (6 scales),
                   cand bend options (6, in renderAdvice/applyBend),
                   instTone branches (piano/guitar/violin/flute + else=music box).
  - index.html   : 8 sections (h2), 5 styles, 5 instrument buttons.
    Sections are nodes on their own; no section->function wiring is
    invented, because the buttons are wired via addEventListener in JS,
    not inline onclick attributes.

Output: graphify-out/cover-graph.json
  nodes: function | technique | bend | scale | instrument | style | section
  edges: CALLS | OFFERS (applyBend/renderAdvice -> bend) |
         PLAYS (instTone -> instrument) | USES_SCALE (scaleNotes -> scale)
Run: python3 tools/build-cover-graph.py
"""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
JS = (ROOT / "code" / "app.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

nodes, edges = {}, []
def node(id_, label, kind, extra=None):
    nodes[id_] = {"id": id_, "label": label, "kind": kind, **(extra or {})}
def edge(src, dst, rel):
    edges.append({"source": src, "target": dst, "relation": rel,
                  "confidence": "EXTRACTED", "confidence_score": 1.0})

# --- functions + CALLS ---
defs = [(m.group(1), m.start()) for m in re.finditer(r'\bfunction\s+([A-Za-z_$][\w$]*)\s*\(', JS)]
names = [n for n, _ in defs]
for i, (name, start) in enumerate(defs):
    end = defs[i + 1][1] if i + 1 < len(defs) else len(JS)
    body = JS[start:end]
    node(f"fn:{name}", f"{name}()", "function")
    for callee in sorted(set(re.findall(r'\b([A-Za-z_$][\w$]*)\s*\(', body))):
        if callee in names and callee != name:
            edge(f"fn:{name}", f"fn:{callee}", "CALLS")

# --- techniques (TECHS, first 8 distinct) ---
techs = []
for name in re.findall(r"name:'([^']+)'", JS):
    if name not in techs:
        techs.append(name)
techs = techs[:8]
for t in techs:
    node(f"tech:{t}", t, "technique")

# --- bend options (cand ids in renderAdvice/applyBend) ---
bends = []
for b in re.findall(r"\{id:'([^']+)'", JS):
    if b not in bends:
        bends.append(b)
for b in bends:
    node(f"bend:{b}", b, "bend")
    edge("fn:applyBend", f"bend:{b}", "OFFERS")
    edge("fn:renderAdvice", f"bend:{b}", "OFFERS")

# --- scales ---
scales = re.findall(r'(\w+):\[[0-9,]+\]', re.search(r'var SCALES=\{([^}]+)\}', JS).group(1))
labels = dict(re.findall(r"(\w+):'([^']+)'", re.search(r'var SCALE_LABEL=\{([^}]+)\}', JS).group(1)))
for s in scales:
    node(f"scale:{s}", labels.get(s, s), "scale")
    edge("fn:scaleNotes", f"scale:{s}", "USES_SCALE")

# --- instruments (instTone branches + else = music box) ---
insts = sorted(set(re.findall(r"inst==='(\w+)'", JS))) + ["box"]
inst_label = {"piano": "Piano", "guitar": "Guitar", "violin": "Violin",
              "flute": "Sáo / Flute", "box": "Hộp nhạc"}
for inst in insts:
    node(f"inst:{inst}", inst_label[inst], "instrument")
    edge("fn:instTone", f"inst:{inst}", "PLAYS")

# --- styles (5 buttons in HTML) ---
styles = ["R&B Luyến Láy", "Ballad Mộc", "Indie Ngẫu Hứng", "Jazz / Soul", "Pop Bùng Nổ"]
for s in styles:
    assert s in HTML, f"style missing from HTML: {s}"
    node(f"style:{s}", s, "style")

# --- sections (h2) + onclick wiring ---
h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', HTML, re.S)
for h in h2s:
    title = re.sub(r'<[^>]+>', '', h).strip()
    node(f"section:{title}", title, "section")
# (No section->function edges: wiring is via addEventListener, not onclick.)

out = {"nodes": list(nodes.values()), "edges": edges,
       "meta": {"source": "code/app.js + index.html", "extraction": "deterministic, no LLM",
                "counts": {"nodes": len(nodes), "edges": len(edges)}}}
dest = ROOT / "graphify-out" / "cover-graph.json"
dest.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"nodes={len(nodes)} edges={len(edges)} -> {dest}")
from collections import Counter
print(Counter(n["kind"] for n in nodes.values()))
print(Counter(e["relation"] for e in edges))
