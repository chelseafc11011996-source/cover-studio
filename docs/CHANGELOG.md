# CHANGELOG

## v0.1.0 — 2026-11-23

- Snapshot đầu tiên của Cover Studio (artifact `cover-studio-tao-ban-sac-rieng`).
- `index.html`: bản export tĩnh đầy đủ — tải bài, phân tích, Note Studio
  4 bước (sóng âm → nốt nhạc → nhạc cụ giả lập → tư vấn bẻ nốt), tách
  lời/nhạc ước lượng, 5 phong cách, phòng lab 8 kỹ thuật, thang âm,
  xưởng bẻ câu hát, Bản đồ cover xuất `.txt`.
- Graphify chính thức: 43 node, 107 edge, 7 community (code-only, 0 token LLM).
- Graph tính năng `cover-graph.json`: 81 node, 113 edge (script
  `tools/build-cover-graph.py`, xác định, không dùng LLM).
