# 🚀 Setup Backend Basic (Node.js + Prisma + PostgreSQL + Docker)

## 0️⃣ Yêu cầu

- Node.js >= 18
- Docker & Docker Compose
- npm

## 1️⃣ Khởi động Database bằng Docker

### Chạy database

```bash
docker compose up -d
```

### Kiểm tra container

```bash
docker ps
```

## 2️⃣ Cài dependency

```bash
npm install
```

## 3️⃣ Cài & khởi tạo Prisma

```bash
npx prisma init
```

👉 Lệnh này sẽ tạo:

```
prisma/
└─ schema.prisma
```

👉 Đồng thời sinh file `.env`

### Sửa .env cho đúng PostgreSQL (QUAN TRỌNG)

```env
DATABASE_URL="postgresql://todolist_user:todolist_pass@localhost:5432/todolist_db"
```

⚠️ KHÔNG dùng mysql URL vì project đang chạy Postgres bằng Docker.

## 4️⃣ Tạo schema Todo (QUAN TRỌNG)

### Mở file: `prisma/schema.prisma`

Ví dụ:

```prisma
model Todo {
    id        Int      @id @default(autoincrement())
    title     String
    completed Boolean  @default(false)
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

## 5️⃣ Migrate database & generate Prisma Client

```bash
npx prisma migrate dev --name init
npx prisma generate
```

👉 Kết quả:

- Database tạo bảng Todo
- Prisma Client sẵn sàng dùng trong code

## 6️⃣ Kiểm tra database (tuỳ chọn)

```bash
npx prisma studio
```

👉 Mở browser để xem & chỉnh sửa dữ liệu trực tiếp.

## 7️⃣ Chạy backend

```bash
npm run dev
```

Server mặc định: `http://localhost:3000`

## 📌 Done!

Dừng và xóa container cũ:

```bash
docker rm -f todolist-db
```

Chạy lại lệnh khởi động:

```bash
docker compose up -d
```

Đẩy cấu hình vào Database

```bash
npx prisma db push
```

Khởi động giao diện quản lý dữ liệu

```bash
npx prisma studio
```

Hướng dẫn chạy dự án CTDLGT
Dự án bao gồm 2 phần: Backend (Node.js/Express) và Frontend (React/Vite). Bạn cần chạy cả 2 để ứng dụng hoạt động đầy đủ.

1. Yêu cầu
Node.js đã được cài đặt.
Các thư viện (node_modules) đã được cài đặt (Tôi đã kiểm tra thấy chúng đã tồn tại).
2. Chạy Backend
Backend sẽ chạy trên cổng mặc định (thường là 3000 hoặc được cấu hình trong 
.env).

Mở terminal mới.
Di chuyển vào thư mục backend:
```bash
cd backend
```

Chạy lệnh:
```bash
npm run dev
```
Cách khác: Bạn có thể chạy file 
start_server.bat
 ở thư mục gốc để tự động chạy backend.

3. Chạy Frontend
Frontend sẽ chạy trên cổng development của Vite (thường là 5173).

Mở terminal mới (khác với terminal backend).
Di chuyển vào thư mục frontend:
```bash
cd frontend
```

Chạy lệnh:
```bash
npm run dev
