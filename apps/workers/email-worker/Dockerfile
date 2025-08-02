FROM node:18-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# --- СТАДИЯ 2: Создание продакшен-образа ---
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY prisma ./prisma
RUN npx prisma generate

# Команда для запуска нашего воркера
CMD ["node", "dist/main"]