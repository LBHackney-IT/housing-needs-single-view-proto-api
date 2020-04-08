FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN mv .env.test .env

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "docker-test"]
