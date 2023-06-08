FROM node:16

WORKDIR /usr/app/src/
COPY src .
RUN npm install

EXPOSE 3000

CMD [ "node", "server.js" ]




