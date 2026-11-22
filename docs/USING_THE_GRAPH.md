# Dùng graph thay vì đọc lại toàn bộ file

## Graph chính thức (Graphify, AST)

`graphify-out/graph.json` — 43 node, 107 edge, 7 community.
Build lại:

```bash
~/workspace/.graphify-venv/bin/graphify extract code --code-only --out .
~/workspace/.graphify-venv/bin/graphify cluster-only . --no-label
```

Tra cứu:

```bash
~/workspace/.graphify-venv/bin/graphify query "applyBend" --graph graphify-out/graph.json
~/workspace/.graphify-venv/bin/graphify explain "transcribe" --graph graphify-out/graph.json
~/workspace/.graphify-venv/bin/graphify path "transcribe" "autoCorr" --graph graphify-out/graph.json
~/workspace/.graphify-venv/bin/graphify affected "noteName" --graph graphify-out/graph.json
```

Nút trung tâm (nhiều edge nhất): `drawBigWave()` (9), `noteName()` (9),
`updateSelUI()` (8), `ac()` (8), `toast()` (8), `applyBend()` (7),
`renderAdvice()` (7). Sửa một nút trong số này thì tra `affected`
trước khi sửa hàng loạt.

Mở `graphify-out/graph.html` trong trình duyệt để xem graph trực quan.

## Graph tính năng (xác định, tự build)

`graphify-out/cover-graph.json` — 81 node, 113 edge. Build lại:

```bash
python3 tools/build-cover-graph.py
```

Loại node: `function` (43), `technique` (8 kỹ thuật lab),
`section` (8 mục), `bend` (6 chiêu tư vấn), `scale` (6 thang âm),
`instrument` (5 nhạc cụ), `style` (5 phong cách).
Loại edge: `CALLS` (90, hàm gọi hàm), `OFFERS` (12,
`applyBend`/`renderAdvice` → chiêu bẻ), `USES_SCALE` (6),
`PLAYS` (5, `instTone` → nhạc cụ). Tất cả đều `EXTRACTED`.

Ví dụ tra cứu bằng Python:

```python
import json
g = json.load(open("graphify-out/cover-graph.json"))
# hàm nào gọi applyBend?
print([e["source"] for e in g["edges"] if e["target"] == "fn:applyBend"])
# instTone chơi được những nhạc cụ nào?
print([e["target"] for e in g["edges"] if e["relation"] == "PLAYS"])
```

## Quy tắc

1. Tra graph trước, rồi đối chiếu đúng 1 hàm / tính năng đó trong
   `code/app.js` hoặc `index.html`.
2. Không bao giờ bịa tên hàm, kỹ thuật, thang âm hay nhạc cụ.
   Nếu tra graph không thấy, nói rõ là không thấy, không suy đoán.
