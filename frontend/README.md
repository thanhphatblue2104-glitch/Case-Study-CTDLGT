# Frontend - Case Study CTDLGT

Đây là giao diện người dùng (Frontend) cho dự án Quản lý Kho, được xây dựng bằng **React**, **Vite**, và **Tailwind CSS**.

## 0️⃣ Yêu cầu (Prerequisites)

- [Node.js](https://nodejs.org/) (Phiên bản v18 trở lên)
- Backend đang chạy (để API hoạt động đúng)

## 1️⃣ Cài đặt (Installation)

1.  Di chuyển vào thư mục frontend:
    ```bash
    cd frontend
    ```

2.  Cài đặt các thư viện:
    ```bash
    npm install
    ```

## 2️⃣ Chạy dự án (Run Project)

### Môi trường Dev
Để khởi động server phát triển (Development Server):

```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173` (hoặc port khác nếu 5173 đang bận, xem terminal để biết chi tiết).

### Build cho Production
Để đóng gói ứng dụng:

```bash
npm run build
```
File đóng gói sẽ nằm trong thư mục `dist/`.

## 3️⃣ Cấu trúc thư mục chính

-   `src/apis.ts`: Cấu hình Axios gọi API tới Backend.
-   `src/pages/`: Các trang chính (Dashboard, Inventory, Export...).
-   `src/services/`: Logic xử lý dữ liệu (InventoryManager - thuật toán Heap/Queue).
-   `src/types.ts`: Định nghĩa kiểu dữ liệu TypeScript.

## 4️⃣ Lưu ý

-   Nếu không gọi được API, hãy kiểm tra xem Backend có đang chạy ở `http://localhost:3000` không.
-   Nếu muốn đổi port backend, hãy sửa trong file `src/api.ts` hoặc biến môi trường `VITE_API_URL`.
