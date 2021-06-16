FROM mhart/alpine-node:15.13.0
RUN apk update && apk upgrade
RUN apk add nodejs
RUN rm -rf /var/cache/apk/*

COPY . /src
WORKDIR /src
RUN cd /src; npm install
EXPOSE 8080
RUN adduser -D myuser
USER myuser
CMD ["node", "/src/server.js"]
