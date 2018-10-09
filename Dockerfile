FROM alpine:3.4
RUN apk update && apk upgrade
RUN apk add nodejs=8.11.3
RUN rm -rf /var/cache/apk/*

COPY . /src
WORKDIR /src
RUN cd /src; npm install
EXPOSE 8080
CMD ["node", "/src/server.js"]
