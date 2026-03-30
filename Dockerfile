FROM node:22-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN npx prisma generate
RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "yarn db:migrate:deploy && yarn start:prod"]
