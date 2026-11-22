# AGENTS.md — quy tắc cho trợ lý làm việc trên repo này

- Nguồn sự thật là webtool trong Muse (artifact
  `cover-studio-tao-ban-sac-rieng`) và file `index.html` đã export.
  Repo GitHub chỉ lưu trữ và quản lý phiên bản, không thay thế webtool.
- Trước khi trả lời về một hàm / tính năng: tra
  `graphify-out/graph.json` (graph chính thức) và
  `graphify-out/cover-graph.json` (graph tính năng) trước, rồi chỉ đọc
  đúng chỗ đó trong `code/app.js` / `index.html`. Không bịa tên hàm,
  tên kỹ thuật hay thang âm.
- Mọi edge trong graph tính năng đều là `EXTRACTED`: lấy trực tiếp từ
  code / HTML. Edge nào không có trong file thì không được vẽ thêm.
- `code/app.js` là JS tách nguyên văn từ `<script>` trong `index.html`,
  chỉ để chạy Graphify — không sửa tay. Muốn đổi tính năng thì sửa qua
  artifact trong Muse, export lại `index.html`, tách lại JS, rồi rebuild
  cả hai graph.
- Không publish/share webtool, không đẩy repo public khi chưa có quyết
  định công khai của người quản lý.
- Sau mỗi thay đổi: rebuild graph, chạy kiểm tra `node --check` tương
  đương / parse lại file, ghi vào `docs/CHANGELOG.md`.
