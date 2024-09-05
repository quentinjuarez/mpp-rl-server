FROM node:16-alpine

# Enable Corepack and prepare Yarn
RUN corepack enable && \
    corepack prepare yarn@3.5.0 --activate

# Create app directory
WORKDIR /usr/src/mpp-rl-server

# Copy and install dependencies
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./.yarnrc.yml

RUN yarn install

# Bundle app source
COPY . .

RUN yarn build
# COPY ./src/public/favicon.ico ./dist/public/favicon.ico

EXPOSE 3001

CMD ["node", "dist/index.js"]