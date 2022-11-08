FROM node:16-alpine

WORKDIR /app
RUN npm install -g pm2 dotenv
COPY db_migrate ./
COPY app.config.js ./
COPY tsconfig.json ./
COPY package*.json ./
RUN chmod 755 ./db_migrate && npm install && mkdir /app/dist
COPY ./dist ./
COPY ./dist ./dist/
RUN mkdir -p prisma
COPY ./prisma ./prisma/
RUN npx prisma generate
EXPOSE 3000
CMD cat /vault/secrets/env && sleep 36000
