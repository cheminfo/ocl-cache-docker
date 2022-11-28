FROM node:18

EXPOSE 20808

RUN mkdir /node
COPY src /node/src
COPY scripts /node/scripts
COPY package.json /node/

WORKDIR /node
RUN npm i 

COPY tsconfig* /node/

CMD Debug* npm start
