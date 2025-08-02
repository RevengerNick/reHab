FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и lock-файл
COPY package*.json ./

# Устанавливаем все зависимости, включая devDependencies для сборки
RUN npm install

# Копируем весь исходный код дашборда
COPY . .

# Собираем приложение для продакшена.
# Эта команда создает оптимизированную сборку в папке .next
RUN npm run build

# --- СТАДИЯ 2: Создание финального продакшен-образа ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Устанавливаем ТОЛЬКО production зависимости
# Next.js - это production-зависимость
COPY package*.json ./
RUN npm install --only=production

# Копируем конфигурацию Next.js из стадии сборки
COPY --from=builder /usr/src/app/next.config.ts ./
# Копируем папку с публичными ассетами (изображения, шрифты)
COPY --from=builder /usr/src/app/public ./public
# Копируем саму собранную и оптимизированную сборку приложения
COPY --from=builder /usr/src/app/.next ./.next

# Открываем порт 3000 (стандартный порт для Next.js)
EXPOSE 3000

# Команда для запуска продакшен-сервера Next.js
CMD ["npm", "start"]