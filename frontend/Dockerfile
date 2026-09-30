# Imagen única para desarrollo con hot reload
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package.json ./
RUN npm install

# El código se monta como volumen en docker-compose.yml
EXPOSE 3000

# npm run dev activa hot reload de Next.js
CMD ["npm", "run", "dev"]
