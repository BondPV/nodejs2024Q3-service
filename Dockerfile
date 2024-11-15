FROM node:22-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

COPY prisma ./prisma

COPY doc ./doc

RUN npm ci && npx prisma generate && npm cache clean --force

COPY --chown=node:node . .

CMD ["npm", "run", "start:dev"]
