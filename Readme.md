1. mkdir each folder
2. npm init --y to create package.json
3. npm i express cors dotenv && npm install nodemon -D
4. Repeat in every folder:
   npm init --y && npm i express cors dotenv bcryptjs uuid jsonwebtoken && npm install nodemon winston -D && npm i typescript @types/node ts-node nodemon @types/express @types/bcryptjs --save-dev

```
docker-compose down
docker-compose build --no-cache && docker-compose up
```

rm -rf ./products/node_modules ./customer/node_modules ./shopping/node_modules
rm -rf ./products/opt ./customer/opt ./shopping/opt
rm -rf ./products/package-lock.json ./customer/package-lock.json ./shopping/package-lock.json
rm -rf ./products/app_error.log ./customer/app_error.log ./shopping/app_error.log
