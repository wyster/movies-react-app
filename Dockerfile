ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn

RUN corepack enable
RUN yarn install --immutable

COPY . .

EXPOSE 80

CMD ["yarn", "start"]
