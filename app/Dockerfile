# Image de production du squelette glossaflow-api.
# Multi-stage : dépendances installées à part, exécution non-root sur base alpine.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
RUN apk upgrade --no-cache && adduser -D -u 10001 nodeuser
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./
USER nodeuser
EXPOSE 3000
CMD ["node", "src/server.js"]
