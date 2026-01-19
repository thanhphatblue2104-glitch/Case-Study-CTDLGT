# Backend - Case Study CTDLGT

Đây là backend cho dự án Quản lý Kho (Warehouse Management), được viết bằng **Node.js**, **Express**, và **Prisma** (SQLite).

## 0️⃣ Yêu cầu (Prerequisites)

Trước khi chạy, hãy đảm bảo máy bạn đã cài:
- Node.js >= 18
- Docker & Docker Compose
- npm

## 1️⃣ Cài đặt (Installation)

1.  Di chuyển vào thư mục backend:
    ```bash
    cd backend
    ```

2.  Cài đặt các gói thư viện (dependencies):
    ```bash
    npm install
    ```

## 2️⃣ Cấu hình Database (Prisma + SQLite)

Dự án sử dụng SQLite (file `dev.db`), nên bạn không cần cài đặt MySQL hay PostgreSQL.

1.  Khởi tạo database và áp dụng schema:
    ```bash
    npx prisma db push
    ```
    *(Lệnh này sẽ tạo file `prisma/dev.db` dựa trên `schema.prisma`)*

2.  (Tùy chọn) Chạy script tạo dữ liệu mẫu nếu có:
    ```bash
    npx ts-node create_user_script.ts
    ```

3.  (Tùy chọn) Xem dữ liệu bằng giao diện trực quan:
    ```bash
    npx prisma studio
    ```

## 3️⃣ Chạy dự án (Run Project)

### Môi trường Dev (Development)
Chạy server với chế độ hot-reload (tự động restart khi sửa code):

```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

### Môi trường Prod (Production)
Build và chạy code JS đã biên dịch:

```bash
npm run build
npm start
```

## 4️⃣ Cấu trúc thư mục

-   `src/server.ts`: Entry point của ứng dụng.
-   `src/modules/`: Chứa các controller, service, route cho từng tính năng (Inventory, Product, Auth...).
-   `prisma/schema.prisma`: Định nghĩa cấu trúc Database.
-   `dev.db`: File database SQLite (được tạo tự động).

## 5️⃣ Ghi chú

-   Đảm bảo frontend chạy đúng port API (mặc định frontend gọi `localhost:3000`).
-   Nếu gặp lỗi liên quan đến Prisma client, hãy chạy: `npx prisma generate`
