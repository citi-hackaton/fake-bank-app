FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /opt/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY ./ ./

RUN npx prisma generate
RUN yarn build

CMD [ "yarn", "start" ]
