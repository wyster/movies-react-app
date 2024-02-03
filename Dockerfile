ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim

ARG APP_API_URL
ENV REACT_APP_API_URL=${APP_API_URL}

COPY . /app
WORKDIR /app

RUN ls -la /app/build

CMD ["yarn", "start"]

EXPOSE 80
