FROM node:22-alpine AS builder

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

COPY prisma ./prisma

RUN npm i --force && npm cache clean --force

COPY --chown=node:node . .

RUN npm run build


FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app .

EXPOSE ${PORT}

CMD ["npm", "run", "start:migrate:dev"]
