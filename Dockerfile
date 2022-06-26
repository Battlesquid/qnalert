FROM node:alpine
COPY . /
CMD npm i && npm run start