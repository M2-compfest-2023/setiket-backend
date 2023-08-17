FROM node:18-alpine

WORKDIR /home/node/app/

COPY package*.json ./

RUN npm install

COPY . .

RUN rm -rf docker

CMD [ "npm", "run", "db:push", "&", "npm", "run", "start:dev" ]
