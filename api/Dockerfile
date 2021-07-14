FROM node:14-alpine as node_modules
WORKDIR /app

COPY package*.json ./

RUN npm install

FROM node:14-alpine 
RUN npm install nodemon -g

WORKDIR /app
COPY --from=node_modules /app .
COPY src ./src
CMD [ "nodemon", "--quiet", "./src/index.js" ]