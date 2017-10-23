FROM node
ADD package.json /app/
WORKDIR /app
RUN npm install

ADD ./lib /app/lib
ADD ./knexfile.js /app

EXPOSE 3000
CMD npm start
