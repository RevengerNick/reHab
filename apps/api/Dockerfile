FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
# Этот шаг кэшируется, если файлы не менялись, что ускоряет сборку
COPY package*.json ./

# Устанавливаем ВСЕ зависимости, включая devDependencies для сборки
RUN npm install

# Копируем исходный код проекта
COPY . .

# Генерируем Prisma Client (необходим для сборки)
RUN npx prisma generate

# Собираем приложение, компилируя TypeScript в JavaScript
RUN npm run build

# --- СТАДИЯ 2: Создание продакшен-образа ---
FROM node:18-alpine

WORKDIR /usr/src/app

# Снова копируем package.json для установки только продакшен-зависимостей
COPY package*.json ./

# Устанавливаем ТОЛЬКО production зависимости
RUN npm install --only=production

# Копируем скомпилированное приложение из стадии 'builder'
COPY --from=builder /usr/src/app/dist ./dist

# Копируем схему Prisma (необходима для генерации клиента в продакшен-среде)
COPY prisma ./prisma

# Генерируем Prisma Client еще раз, теперь уже для продакшен-образа
RUN npx prisma generate

# Открываем порт 3000, на котором будет работать наше API
EXPOSE 3000

# Команда для запуска приложения
CMD ["node", "dist/main"]