ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim

ARG APP_API_URL
ENV REACT_APP_API_URL=${APP_API_URL}

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install

CMD ["yarn", "start"]

EXPOSE 80
