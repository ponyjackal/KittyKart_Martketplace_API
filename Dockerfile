FROM node:16-alpine

WORKDIR /app
RUN npm install -g pm2
COPY db_migrate /usr/local/bin/
COPY app.config.js ./
COPY tsconfig.json ./
COPY package*.json ./
RUN chmod 755 /usr/local/bin/db_migrate && npm install && mkdir /app/dist
COPY ./dist ./
COPY ./dist ./dist/
RUN mkdir -p prisma
COPY ./prisma ./prisma/
RUN npx prisma generate
EXPOSE 3000
CMD yarn migrate && yarn start
