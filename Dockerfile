FROM node:18-bullseye-slim

WORKDIR /app
RUN npm install -g pm2 dotenv && \
    mkdir /app/dist && \
    apt-get update && \
    apt-get -y install openssl
COPY . ./
RUN yarn install
RUN npx prisma generate
EXPOSE 3000
CMD yarn prestart:prod && pm2-runtime --raw app.config.js
