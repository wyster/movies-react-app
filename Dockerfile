ARG NODE_VERSION=12
FROM node:${NODE_VERSION}-slim

ARG APP_API_URL

COPY . /app
WORKDIR /app

RUN yarn install --production
RUN REACT_APP_API_URL=${APP_API_URL} yarn build
RUN REACT_APP_API_URL=${APP_API_URL} yarn build:ssr

CMD ["yarn", "start"]

EXPOSE 80