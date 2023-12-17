ARG NODE_VERSION=16
FROM node:${NODE_VERSION}-slim

ARG APP_API_URL
ENV REACT_APP_API_URL=${APP_API_URL}

COPY . /app
WORKDIR /app

RUN npm ci
RUN npx update-browserslist-db@latest
RUN npm run build

CMD ["npm", "start"]

EXPOSE 80
