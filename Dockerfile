FROM node:20.4.0-alpine AS build
WORKDIR /usr/local/ddpe
COPY package.json yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /usr/local/ddpe/public /usr/share/nginx/html
