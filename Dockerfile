FROM node:18

WORKDIR /usr/src/app

COPY . .
RUN npm install

COPY . .

RUN npm install typescript

CMD ["npm", "start"]
