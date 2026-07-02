# Image de production du squelette glossaflow-api.
# Multi-stage : dépendances installées à part, exécution non-root sur base alpine.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
# apk upgrade : correctifs de l'OS ; suppression de npm/npx : le conteneur de
# production n'en a pas besoin et leurs dépendances embarquées trainent des CVE
RUN apk upgrade --no-cache \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
    && adduser -D -u 10001 nodeuser
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./
USER nodeuser
EXPOSE 3000
CMD ["node", "src/server.js"]
