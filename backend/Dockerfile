FROM node:18-alpine

# Tạo user non-root
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Copy file cần thiết trước để cache npm install
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

USER app

EXPOSE 3000

CMD ["npm", "start"]
