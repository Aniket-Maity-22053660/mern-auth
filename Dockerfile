FROM node:20

WORKDIR /app

COPY ./server/package*.json .

RUN npm install

COPY ./server .

EXPOSE 4000

CMD ["npm", "run", "dev"]