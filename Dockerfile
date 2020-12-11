ARG NODE_VERSION=12
FROM node:${NODE_VERSION}-slim

ARG APP_API_URL
ENV REACT_APP_API_URL=${APP_API_URL}

COPY . /app
WORKDIR /app

RUN yarn install --production
RUN yarn build
RUN yarn build:ssr

CMD ["yarn", "start"]

EXPOSE 80