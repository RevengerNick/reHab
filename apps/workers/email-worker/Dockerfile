FROM --platform=linux/arm64/v8 node:20-alpine AS base

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start"]