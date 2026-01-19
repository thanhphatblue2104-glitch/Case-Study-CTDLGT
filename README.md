# Hướng Dẫn Chạy Dự Án (Case Study CTDLGT)

Đây là hướng dẫn chi tiết để chạy dự án này từ A-Z.

## 1. Yêu cầu cần có (Prerequisites)

Hãy đảm bảo máy tính của bạn đã cài đặt **Node.js**.
- Kiểm tra bằng cách mở Terminal (CMD/PowerShell) và gõ: `node -v`
- Nếu chưa có, tải tại: [nodejs.org](https://nodejs.org/) (Nên dùng bản LTS).

---

## 2. Cài đặt và Chạy Backend

Backend là nơi xử lý dữ liệu và kết nối Database.

1.  **Mở Terminal** tại thư mục gốc của dự án (`Source code`).
2.  Di chuyển vào thư mục backend:
    ```bash
    cd backend
    ```
3.  Cài đặt các thư viện cần thiết:
    ```bash
    npm install
    ```
4.  Khởi tạo Database (SQLite):
    ```bash
    npx prisma db push
    ```
    *(Lệnh này sẽ tạo file `dev.db` trong thư mục `backend/prisma` dựa trên cấu trúc đã định nghĩa).*
5.  Khởi động server:
    ```bash
    npm run dev
    ```
    > **Thành công:** Bạn sẽ thấy thông báo server chạy tại `http://localhost:3000`. Hãy giữ cửa sổ Terminal này mở.

---

## 3. Cài đặt và Chạy Frontend

Frontend là giao diện người dùng (Web).

1.  **Mở một cửa sổ Terminal MỚI** (không tắt cửa sổ Backend).
2.  Di chuyển vào thư mục frontend:
    ```bash
    cd frontend
    ```
    *(Nếu đang ở thư mục gốc thì dùng lệnh trên. Nếu đang ở folder backend thì gõ `cd ../frontend`)*
3.  Cài đặt các thư viện:
    ```bash
    npm install
    ```
4.  Khởi động giao diện web:
    ```bash
    npm run dev
    ```
    > **Thành công:** Bạn sẽ thấy đường dẫn (thường là `http://localhost:3030`). Giữ phím `Ctrl` và click vào link để mở trình duyệt.

---

## 4. Tổng Kết

Bạn cần chạy song song 2 cửa sổ Terminal:
- **Terminal 1 (Backend):** Đang chạy `npm run dev` (Port 3000).
- **Terminal 2 (Frontend):** Đang chạy `npm run dev` (Port 3030).

## 5. Lưu ý bổ sung

- **File `start_server.bat`:** File này trong thư mục gốc hiện tại chỉ giúp bạn khởi động Backend nhanh. Bạn vẫn cần mở thêm terminal để chạy Frontend thủ công.
- **Database:** Dự án dùng SQLite nên dữ liệu lưu trong file local, không cần cài MySQL/PostgreSQL phức tạp.
