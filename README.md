# Cover Studio — Tạo bản sắc riêng khi cover

Web tiếng Việt giúp một người bình thường tạo bản cover độc bản cho bất kỳ
bài hát nào: tải bài gốc lên, xem sóng âm, chuyển thành nốt nhạc, nghe lại
bằng nhạc cụ giả lập, rồi nhận tư vấn đoạn nào nên bẻ nốt / luyến kiểu gì.

Bản web đang chạy trong Muse: artifact `cover-studio-tao-ban-sac-rieng`.
Repo GitHub của dự án này:
`https://github.com/chelseafc11011996-source/cover-studio` (nhánh `main`).

File `index.html` trong repo này là bản export tĩnh của webtool đó, dùng để
lưu trữ và quản lý phiên bản, không phải bản chỉnh sửa trực tiếp: muốn đổi
tính năng thì sửa qua artifact trong Muse rồi export lại và commit.

## Luồng dùng chính (4 bước Note Studio)

1. **Tải bài hát gốc lên** — phát, xem sóng âm, ước lượng tông / nhịp /
   thời lượng ngay trong trình duyệt.
2. **Sóng âm → nốt nhạc** — phân tích cao độ (autocorrelation) ngay trong
   trình duyệt rồi vẽ thành piano-roll: ô dài = nốt giữ lâu, ô cao = nốt
   cao, bấm vào nốt để nghe riêng. Kéo chuột / ngón tay trên sóng để khoanh
   đoạn, hoặc chọn nhanh Toàn bài / Cao trào / Yên nhất / Đầu / Cuối.
3. **Nghe nhạc cụ giả lập** — Piano / Guitar / Violin / Sáo / Hộp nhạc phát
   lại đúng giai điệu đã tách, theo thứ tự: đoạn gốc → nhạc cụ phát gốc →
   bản đã bẻ nốt.
4. **Nhận tư vấn & bẻ nốt** — tư vấn đọc nốt thật trong đoạn (nốt dài nhất,
   nốt cao nhất, mật độ, chỗ lặp nốt, có nằm ở cao trào không) và xếp hạng
   3 chiêu hợp nhất kèm lý do bằng số liệu. Áp dụng là piano-roll vẽ lại
   nốt màu cam, nghe thử ngay, chốt vào Bản đồ cover (tải `.txt`).

Các phần khác: tách lời / nhạc ước lượng (bản gốc / chỉ nhạc karaoke /
chỉ giọng), 5 phong cách cá nhân (R&B Luyến Láy, Ballad Mộc, Indie Ngẫu
Hứng, Jazz / Soul, Pop Bùng Nổ), phòng lab 8 kỹ thuật luyến láy, thang âm
với đàn piano tương tác, xưởng bẻ câu hát trên chính lời người dùng dán vào.

## Dữ liệu đã kiểm chứng (không đoán)

- 1 file duy nhất `index.html`: 74.994 byte, 571 dòng, 43 hàm JS, 76 id.
- 8 mục (h2), 5 phong cách, 5 nhạc cụ, 8 kỹ thuật lab, 6 thang âm
  (Minor Pentatonic, Major Pentatonic, Blues, Dorian, Major, Natural Minor),
  6 chiêu bẻ nốt trong tư vấn (melisma, vibrato, run, octave, falsetto, bend).
- Bài mẫu tổng hợp trong web: 22 nốt, đoạn cao trào 13–20 giây.

## Giới hạn thật cần biết

- Chuyển bài hát thành nốt là **ước lượng cao độ trong trình duyệt**
  (autocorrelation, lọc nốt < 0,18 giây), không phải tách AI bằng máy chủ.
  Bài vocal rõ, giai điệu đơn giản cho kết quả tốt nhất; bài phối dày,
  nhiều nhạc cụ chồng nhau có thể tách sai nốt — luôn chỉnh lại bằng tai.
- Tách lời / nhạc cũng là ước lượng bằng lọc tần số / triệt stereo trong
  trình duyệt, không phải tách stem AI chuẩn phòng thu.
- Tông / nhịp là ước lượng, ô chọn tông là mặc định làm việc để người dùng
  chỉnh lại.

## Graphify: dùng graph thay vì đọc lại toàn bộ file

Hướng dẫn chi tiết, kèm lệnh tra cứu đã kiểm chứng:
`docs/USING_THE_GRAPH.md`.

Graphify (PyPI: `graphifyy`, CLI vẫn là `graphify`, Apache-2.0) parse code
bằng tree-sitter ngay trên máy, không dùng LLM, không cần vector store.
Chế độ code-only tốn 0 token LLM.

```bash
# Cài một lần (máy này đã cài vào ~/workspace/.graphify-venv)
python3 -m venv ~/workspace/.graphify-venv
~/workspace/.graphify-venv/bin/pip install graphifyy

# Graphify không parse <script> inline trong .html, nên JS đã được tách
# nguyên văn ra code/app.js (file sinh ra, không sửa tay) chỉ để chạy graph:
~/workspace/.graphify-venv/bin/graphify extract code --code-only --out .
~/workspace/.graphify-venv/bin/graphify cluster-only . --no-label

# Graph riêng về tính năng (xác định, không dùng LLM):
python3 tools/build-cover-graph.py   # -> graphify-out/cover-graph.json
```

Kết quả đã kiểm chứng ngày 2026-11-23:

- Graph chính thức: **43 node, 107 edge, 7 community**, 94% EXTRACTED,
  6% INFERRED, 0 token LLM. Nút trung tâm: `drawBigWave()` (9 edge),
  `noteName()` (9), `updateSelUI()` (8), `ac()` (8), `toast()` (8).
- Graph tính năng `cover-graph.json`: **81 node, 113 edge** — 43 hàm,
  8 kỹ thuật, 8 mục, 6 chiêu bẻ, 6 thang âm, 5 nhạc cụ, 5 phong cách.
