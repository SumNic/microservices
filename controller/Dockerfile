FROM node:18.15

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# COPY ./dist ./dist

EXPOSE 7000

CMD ["npm", "run", "start:dev"]