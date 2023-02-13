FROM node:18.14.0-alpine
ENV NODE_ENV=production

WORKDIR /usr/src/app

RUN corepack enable

COPY ./api/package.json ./api/
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./api/src ./api/src

RUN pnpm install --frozen-lockfile --ignore-scripts --prod --filter "tms-api..."

WORKDIR /usr/src/app/api
EXPOSE 3001
CMD [ "node", "./src/index.js" ]