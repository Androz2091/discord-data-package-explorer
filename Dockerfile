FROM node:26.13.0-alpine AS build
WORKDIR /usr/local/ddpe
# Node 25 and later no longer ship Corepack, which runs the Yarn version `packageManager` pins.
RUN npm install --global corepack@0.36.0 && corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
RUN yarn build

FROM nginx:1.31.8-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/ddpe/dist /usr/share/nginx/html
