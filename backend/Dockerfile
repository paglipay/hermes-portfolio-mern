# Use official Node LTS image
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci --omit=dev
EXPOSE 5000
CMD ["node", "server.js"]
