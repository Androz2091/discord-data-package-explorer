FROM node:20.4.0-alpine AS build
WORKDIR /usr/local/ddpe
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml .
RUN yarn install --immutable
COPY . .
RUN yarn build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/ddpe/public /usr/share/nginx/html
