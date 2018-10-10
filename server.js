'use strict';

// Node modules
const Hapi = require('hapi');
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const JWT = require('jsonwebtoken');  // used to sign our content
const mongoose = require('mongoose');

const Routes = require('./controllers/routes.js');
const MongoDBUrl = process.env.MONGO_DB_URL;

const server = new Hapi.Server({ port: process.env.PORT || 8080 });

const secret = process.env.JWT_SECRET;

// A dummy person to get the JWT token.
const people = {
    1: {
        id: 1,
        name: 'Tony Valid User',
    }
};

const validate = async function (decoded, request, h) {
    // check to see if the person is valid.
    if (!people[decoded.id]) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
};

if (secret && process.env.NODE_ENV && process.env.NODE_ENV === 'dev') {
    // one can use the token as the 'authorization' header in requests
    const token = JWT.sign(people[1], secret); // synchronous
    console.log(token);
}

const startServers = async () => {
    try {
        if (secret) {
            await server.register(hapiAuthJwt2);
            server.auth.strategy('jwt', 'jwt',
                { key: secret,
                    validate,
                    verifyOptions: { ignoreExpiration: true }
                });
            server.auth.default('jwt');
        }
        Routes(server);
        await server.start();
        console.log('Server running at:', server.info.uri);
        mongoose.connect(MongoDBUrl, { useNewUrlParser: true, useCreateIndex: true })
            .then(() => { console.log('Connected to MongoDB server') },
                error => {
                    console.error(error);
                    server.stop({ timeout: 10000 }).then(function (err) {
                        console.log('hapi server stopped')
                        process.exit((err) ? 1 : 0)
                    })
                });
    }
    catch (error) {
        throw error;
    }
}
startServers();

module.exports = server;