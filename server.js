'use strict';

// Node modules
const Hapi = require('hapi');
const mongoose = require('mongoose');

const Routes = require('./controllers/routes.js');
// @todo: put this in an environment variable, so it's not in repo.
// @todo: such as process.env.MONGO_DB_URL.
const MongoDBUrl = 'mongodb://organitza:F34g8*Lob29!hey@ds125453.mlab.com:25453/organitza';

const server = new Hapi.Server({ port: process.env.PORT || 8080 });

const startServers = async () => {
    try {
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