FROM node

WORKDIR /app/products

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8007

CMD ["npm", "start"]
