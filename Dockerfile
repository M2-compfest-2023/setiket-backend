FROM node:18-alpine

WORKDIR /home/node/app/

COPY . .

RUN npm install

RUN rm -rf docker

CMD [ "npm", "run", "db:push", "&", "npm", "run", "start:dev" ]
