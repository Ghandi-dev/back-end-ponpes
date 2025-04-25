# Development stage
FROM node:22-alpine AS dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production stage
FROM node:22-alpine AS prod

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 3001
CMD ["npm", "start"]