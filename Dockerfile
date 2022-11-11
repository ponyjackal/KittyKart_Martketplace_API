FROM node:18-alpine

WORKDIR /app
RUN npm install -g pm2 dotenv && mkdir /app/dist
COPY . ./
RUN yarn install
RUN npx prisma generate
EXPOSE 3000
CMD yarn start:prod
