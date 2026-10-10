ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-slim AS node

ARG APP_API_URL
ENV REACT_APP_API_URL=${APP_API_URL}
ENV NODE_ENV=production

COPY . /app
WORKDIR /app

RUN corepack enable && corepack install
RUN yarn install --immutable
RUN yarn build

FROM nginx:alpine AS runtime

COPY --from=node /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
