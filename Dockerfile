FROM node:12.18.3
WORKDIR /
COPY package.json /
RUN npm install
COPY . /
CMD node --max-old-space-size=50 index.js