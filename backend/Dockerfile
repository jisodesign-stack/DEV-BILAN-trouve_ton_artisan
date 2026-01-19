FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Railway assigne dynamiquement le port via la variable PORT
ENV PORT=3000

CMD ["node", "server.js"]
