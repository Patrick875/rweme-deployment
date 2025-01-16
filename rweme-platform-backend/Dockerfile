FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install 

COPY . .

EXPOSE 5000 

RUN npm db:migrate
RUN npm db:seed

CMD ["npm","start"]