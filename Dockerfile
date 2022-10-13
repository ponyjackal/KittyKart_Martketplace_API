FROM node:alpine

WORKDIR /app
RUN npm install -g pm2
COPY db_migrate /usr/local/bin/
COPY app.config.js ./
COPY tsconfig.json ./
COPY package*.json ./
RUN chmod 755 /usr/local/bin/db_migrate && npm install
COPY ./dist ./
RUN mkdir ./prisma
COPY ./prisma ./prisma/
RUN npx prisma generate
EXPOSE 3000
CMD /usr/local/bin/db_migrate -p ./prisma/ && pm2-runtime --raw app.config.js