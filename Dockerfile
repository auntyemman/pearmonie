# build
FROM node:20-alpine AS builder

WORKDIR /src/app

COPY package.json ./

RUN yarn install

COPY . .

RUN yarn build

# Stage
FROM node:20-alpine

WORKDIR /src/app

COPY --from=builder /src/app/dist ./dist
COPY --from=builder /src/app/node_modules ./node_modules
COPY --from=builder /src/app/package*.json ./
COPY --from=builder /src/app/yarn.lock ./
COPY --from=builder /src/app/.env ./.env

EXPOSE 3001

CMD ["yarn", "start"]