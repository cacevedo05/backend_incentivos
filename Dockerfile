FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json package-lock.json ./

COPY packages/shared/package.json ./packages/shared/
COPY gateway/package.json ./gateway/
COPY services/auth/package.json ./services/auth/
COPY services/employees/package.json ./services/employees/
COPY services/references/package.json ./services/references/
COPY services/orders/package.json ./services/orders/
COPY services/production/package.json ./services/production/
COPY services/work-logs/package.json ./services/work-logs/
COPY services/liquidation/package.json ./services/liquidation/

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

RUN rm -rf src init-db

EXPOSE 3000

ENV NODE_ENV=production
