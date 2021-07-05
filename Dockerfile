FROM node:14
WORKDIR /usr/local/app
COPY . .
RUN yarn install
CMD ["yarn", "dev"]
