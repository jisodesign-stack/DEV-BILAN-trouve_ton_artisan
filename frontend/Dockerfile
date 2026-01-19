# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Augmenter la mémoire pour le build
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Copier package.json ET package-lock.json
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copier le code source
COPY . .

# Build de l'application React avec les variables d'environnement
ENV REACT_APP_API_URL=https://dev-bilan-trouvetonartisan-production.up.railway.app/api
ENV REACT_APP_API_KEY=prod_secure_api_key_2026

RUN npm run build

# Production stage avec serve
FROM node:18-alpine

WORKDIR /app

# Installer serve pour servir les fichiers statiques
RUN npm install -g serve

# Copier les fichiers buildés
COPY --from=build /app/build ./build

# Le port sera injecté par Railway
ENV PORT=3000

# Serve sur le port défini
CMD ["sh", "-c", "serve -s build -l $PORT"]
