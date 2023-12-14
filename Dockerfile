ARG NODE_VERSION=16
FROM node:${NODE_VERSION}-slim

ARG APP_API_URL
ENV REACT_APP_API_URL=${APP_API_URL}

COPY . /app
WORKDIR /app

RUN npm install
RUN npx update-browserslist-db@latest
RUN yarn build

CMD ["npm", "start"]

EXPOSE 80
