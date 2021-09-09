FROM node:14
RUN apt update
RUN apt install -y python3-pip
RUN pip3 install pandas
RUN pip3 install requests

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3001

CMD [ "node", "index.js" ]