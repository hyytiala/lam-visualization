FROM node:14
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3001

CMD [ "node", "index.js" ]