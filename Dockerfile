FROM node:18.14.0

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8080
CMD ["npm", "start"]
