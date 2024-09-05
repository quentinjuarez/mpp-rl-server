FROM node:16-alpine

RUN corepack enable &&
    corepack prepare yarn@3.5.0 --activate

# Create app directory
WORKDIR /usr/src/mpp-rl-server

# Install app dependencies
COPY package.json yarn.lock ./

COPY .yarnrc.yml ./.yarnrc.yml

RUN yarn install

# Bundle app source
COPY . .

RUN yarn build
# COPY ./src/public/favicon.ico ./dist/public/favicon.ico

EXPOSE 3003

CMD ["node", "dist/index.js"]
