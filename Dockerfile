ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-slim AS build

ARG APP_API_URL
ENV REACT_APP_API_URL=${APP_API_URL}

COPY . /app
WORKDIR /app

RUN corepack enable
RUN yarn install

FROM nginx:alpine AS runtime

COPY /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
