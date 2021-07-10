FROM node:14 AS build
WORKDIR /usr/local/ddpe
COPY . .
RUN yarn install && yarn build

FROM nginx:alpine
COPY --from=build /usr/local/ddpe/public /usr/share/nginx/html
