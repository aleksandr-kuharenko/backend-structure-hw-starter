FROM node:14.17.0-buster-slim AS base

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . .

CMD npm run dev
