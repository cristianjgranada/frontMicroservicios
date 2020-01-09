FROM node:latest as node

WORKDIR /appstore

COPY ./ /appstore/

RUN npm install

RUN npm run build -- --prod

FROM nginx:alpine
COPY  --from=node /appstore/dist/storeApp /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
