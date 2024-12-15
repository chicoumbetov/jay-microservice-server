FROM node

WORKDIR /app/shopping

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8006

CMD ["npm", "start"]
