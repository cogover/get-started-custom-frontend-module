# Bắt đầu với Custom Frontend Module

[English](README.md) | [Tiếng Việt](README.vi.md)

Trang TypeScript thuần + Vite hoàn chỉnh, sẵn sàng build thành Custom Frontend
Module trên Cogover. Trang hiển thị thẻ "Hello" của bài hướng dẫn và tải asset
bằng URL tương đối, kể cả khi được host dưới slot như `/_cm_1/`.

Chạy trang local không cần cấu hình Workspace hay thông tin xác thực.
Đây là sample tĩnh độc lập, không gọi sample backend đọc Lead.

## Yêu cầu

- Node.js **20.19+ hoặc 22.12+** và npm (khuyến nghị 22.12+).
  Vite 8 không hỗ trợ các bản Node 20/22 cũ hơn các mốc này.
- Để deploy: có quyền tạo/publish Custom Frontend Module.
- Để deploy bằng CLI: Cogover Dev CLI mới nhất và **Workspace API key**.
  Không cần Project key của backend hay `cogover-dev login`.

## 1. Cài đặt và chạy

Tải hoặc clone repo này, sau đó mở thư mục chứa `package.json`:

```bash
npm ci
npm run dev
```

Mở [http://127.0.0.1:5173](http://127.0.0.1:5173). Bạn sẽ thấy
"Hello from your first frontend module". Dừng bằng Ctrl+C.

- `src/main.ts` render sample tĩnh; nếu thêm dữ liệu động, dùng `textContent`
  cho văn bản từ nguồn không tin cậy.
- `src/style.css` có khoảng cách responsive và quy tắc ngắt dòng.
- `vite.config.ts` đặt `base: "./"`; giữ cấu hình này để hỗ trợ URL slot Cogover.
- `index.html` có ngôn ngữ, tiêu đề trang và viewport cho phép phóng to.
- Không cần font bên ngoài, công cụ phân tích, ảnh từ xa hay lời gọi API.

## 2. Build và kiểm tra

```bash
npm run build
npm run preview
```

Mở [http://127.0.0.1:4173](http://127.0.0.1:4173). Kết quả build có cấu trúc:

```text
dist/
├── index.html
└── assets/
    ├── index-<hash>.js
    └── index-<hash>.css
```

Để chạy test trình duyệt tự động, dừng preview nếu xung đột với tiến trình khác,
sau đó cài trình duyệt dùng cho test một lần:

```bash
npx playwright install chromium
npm run check
```

Trong container Linux tối giản, dùng `npx playwright install --with-deps chromium`
thay thế (cài dependency hệ thống có thể cần quyền root).
`npm run check` build lại và test bằng Chromium ở chiều rộng 320, 375, 768 và
1440px, gồm phóng to chữ, không tràn ngang, tải asset tương đối và không có lỗi
JavaScript. Server chỉ dành cho test phục vụ `dist/` dưới `/_cm_1/`, không ánh xạ
asset về đường dẫn gốc hay fallback cho SPA. Ảnh chụp test được Git ignore.

## 3. Tạo Project Cogover

Trong giao diện Workspace, mở **Custom Frontend Module** và tạo Project nếu chưa
có. Ghi lại **Project ID** (`FEP...`) và **slugSlot** được cấp
(ví dụ `_cm_1`). Nếu đã được cung cấp Project, dùng Project đó.

Slot do Cogover cấp; không mặc định mọi Workspace đều dùng `_cm_1`.
Đây là một đoạn trong URL, không phải Project ID hay slug của Project backend.

## 4. Upload lên Cogover

Chọn một trong hai cách bên dưới; cả hai đều tạo và activate version của cùng
Project. Không chạy cả hai chỉ để publish một version.

### Cách A: Thủ công qua giao diện

Tại thư mục gốc của repo (cần tiện ích `zip`):

```bash
npm run build
zip -r hello-frontend.zip dist -x '*/.*' '__MACOSX/*'
```

Dùng tên ZIP mới (hoặc xóa ZIP đã sinh trước đó) để tránh giữ lại file cũ trong
archive. Các quy tắc loại trừ bỏ qua file ẩn và metadata macOS.
ZIP phải chứa `dist/index.html` và `dist/assets/...`, không chỉ chứa trực tiếp
các file bên trong `dist` ở thư mục gốc của archive.

Mở danh sách version của Project trong Custom Frontend Module, tạo version,
upload `hello-frontend.zip` ở chế độ private, chờ `READY` rồi activate.
Nếu version lỗi, sửa vấn đề build/archive được báo rồi tạo version mới.

### Cách B: Cogover Dev CLI

```bash
npm install --global @cogover/dev-cli
cogover-dev --version
cp cogover.example.json cogover.json
```

Sửa file `cogover.json` đã được Git ignore bằng origin Workspace và Project ID
của bạn:

```json
{
  "version": 1,
  "runtimeUrl": "https://example.cogover.com",
  "projectId": "FEPXXXXXXXXXXXX",
  "projectType": "frontend"
}
```

Giữ **`"projectType": "frontend"`**. Nếu bỏ qua, CLI mặc định là backend.
Dùng HTTPS origin đầy đủ của Workspace, không kèm đường dẫn. Không đặt key hay
`slugSlot` trong cấu hình này. CLI publish Project đã tồn tại, không tạo Project.

```bash
npm run build
cogover-dev publish
```

CLI yêu cầu `dist/index.html`, tự nén `dist/` thành ZIP, upload ở chế độ private,
tạo version và chờ `READY` hoặc `FAILED`. CLI **không tự build**:
hãy build lại sau mỗi lần sửa source. ZIP tạm được xóa sau đó;
thư mục `dist/` được giữ nguyên.

**Workspace API key** được đọc từ `COGOVER_API_KEY` trong `.env` của Project
trước, rồi đến kho lưu thông tin xác thực của hệ điều hành. Nếu không có, CLI yêu
cầu nhập ẩn. Key nhập qua lời nhắc sau khi xác thực thành công sẽ được lưu vào kho
của hệ điều hành nếu có, hoặc file `.env` riêng tư đã được ignore nếu không có.
Trong Docker/CI không tương tác, cấp sẵn `.env` một cách an toàn, không đưa file
đó vào gói upload.

Nếu đã tạo ZIP đúng cấu trúc, bạn có thể chạy
`cogover-dev publish hello-frontend.zip` thay thế. ZIP truyền vào không bị xóa.

Khi thành công, dùng đúng **version ID dạng FEV...** và lệnh activate được in ra:

```bash
cogover-dev activate VERSION_ID
```

Không truyền Project ID dạng FEP... Chỉ activate version thuộc đúng Project
mong muốn và đang `READY`. Thao tác activate thay đổi nội dung người dùng
Workspace nhìn thấy.

## 5. Mở trang đã deploy

Đăng nhập Workspace trong trình duyệt rồi truy cập:

```text
https://example.cogover.com/SLUG_SLOT/index.html
```

Thay domain và `SLUG_SLOT` bằng các giá trị được cấp. Với slot `_cm_1`,
đường dẫn là `/_cm_1/index.html`. Kiểm tra thẻ Hello và bảng Network/Console
của trình duyệt để phát hiện asset không tải được hoặc lỗi.

Xác thực CLI không đăng nhập hộ trình duyệt. Test trình duyệt local chứng minh
bản build chạy được dưới một tiền tố đường dẫn; không chứng minh việc deploy
hay đăng nhập Workspace đã thành công. Không mặc định có fallback cho SPA:
nếu thêm route phía client, dùng hash routing trừ khi môi trường hosting hỗ trợ
rõ ràng cách định tuyến khác.

## Trước khi public repo này

- End-user có thể đọc mọi nội dung trong `src/`, `public/` (nếu thêm) và
  `dist/` đã build. Không đặt API key, token hay dữ liệu riêng tư tại đó.
- **Giá trị `VITE_*` được nhúng vào code phía client**. Ignore `.env` không làm
  secret an toàn nếu Vite đưa giá trị đó vào bundle.
- Workspace API key của CLI chỉ dành cho deploy; không đọc nó từ code ứng dụng.
- `cogover.json`, `.env*`, file session, log, ZIP và các file sinh ra được
  `.gitignore` loại trừ. Kiểm tra file đã stage; file được ignore nhưng đã track
  trước đó vẫn có thể bị commit.
- Chỉ upload `dist/`, không upload toàn bộ repo hay `node_modules/`.
- `test/` và static host phục vụ test là công cụ phát triển local, không phải
  server production và không được đưa vào bản build Vite.

Được cấp phép theo MIT; xem [LICENSE](LICENSE).
