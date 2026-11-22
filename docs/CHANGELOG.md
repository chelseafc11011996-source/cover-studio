# CHANGELOG

## v0.2.0 — 2026-11-23 (khối cải tiến liên tục, 3 vòng)

- Vòng 1 — sửa lỗi đúng/sai: chọn file + kéo-thả gom về một hàm `onFile`,
  decode 1 lần, thanh tiến trình %; nút demo mục 1 ra nốt thật; bỏ số BPM
  giả khi decode lỗi; nhãn "Âm lượng phát"; tập chậm giữ cao độ
  (`preservesPitch`, thêm 0,5×) cho cả audio và synth; toast 5 giây;
  luồng đánh số 1→6 thống nhất; chú giải màu sóng âm và thuật ngữ.
- Vòng 2 — kiểm tra giọng & dịch tông: đo quãng giọng bằng micro hoặc
  chọn tay; gợi ý dịch tông tối ưu −12..+12 nửa cung và áp dụng cho toàn
  bộ nốt đã tách; chế độ luyện tập (lặp đoạn, nghe từng nốt, bộ đếm lần
  tập); hát thử qua micro chấm từng nốt bằng cents; gợi ý nhịp thở theo
  câu nhạc.
- Vòng 3 — sửa nốt + làm mượt cao độ kiểu pYIN (lọc trung vị, phạt lỗi
  quãng 8, tách nốt theo onset); sửa/xóa/dịch nốt trên piano-roll với độ
  tin cậy từng nốt; tư vấn kèm cách hát cụ thể; vibrato rung từ nửa sau
  nốt, falsetto đổi âm sắc; thêm Mixolydian, phím đen, tông thăng/giáng;
  tông ước lượng bằng chroma kèm độ tin cậy; lưu localStorage, bản đồ
  bắt đầu trống; cảnh báo karaoke file mono.
- Graphify chính thức: 80 node, 227 edge, 8 community (code-only, 0 token LLM).
- Graph tính năng `cover-graph.json`: 122 node, 229 edge (script
  `tools/build-cover-graph.py`, xác định, không dùng LLM).
- `index.html`: 136.963 byte, 926 dòng, 82 hàm JS.

## v0.1.0 — 2026-11-23

- Snapshot đầu tiên của Cover Studio (artifact `cover-studio-tao-ban-sac-rieng`).
- `index.html`: bản export tĩnh đầy đủ — tải bài, phân tích, Note Studio
  4 bước (sóng âm → nốt nhạc → nhạc cụ giả lập → tư vấn bẻ nốt), tách
  lời/nhạc ước lượng, 5 phong cách, phòng lab 8 kỹ thuật, thang âm,
  xưởng bẻ câu hát, Bản đồ cover xuất `.txt`.
- Graphify chính thức: 43 node, 107 edge, 7 community (code-only, 0 token LLM).
- Graph tính năng `cover-graph.json`: 81 node, 113 edge (script
  `tools/build-cover-graph.py`, xác định, không dùng LLM).
