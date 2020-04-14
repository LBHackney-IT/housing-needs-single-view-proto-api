FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN mv test_env .env

RUN npm i

EXPOSE 3010

ENV SINGLEVIEW_DB=postgresql://singleview_user:@test_db/hnsingleview

CMD ["npm", "run", "ci"]
