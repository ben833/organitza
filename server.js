'use strict';

// Node modules
const Hapi = require('hapi');
const mongoose = require('mongoose');

// Data
const OrganizationController =  require('./controllers/organization');
const MongoDBUrl = 'mongodb://organitza:F34g8*Lob29!hey@ds125453.mlab.com:25453/organitza';

const server = new Hapi.Server({ port: process.env.PORT || 8080 });

const registerRoutes = () => {
    server.route({
        method: 'GET',
        path: '/organizations',
        handler: OrganizationController.list
    });
    server.route({
        method: 'POST',
        path: '/organizations',
        handler: OrganizationController.create
    });
    server.route({
        method: 'DELETE',
        path: '/organizations/{id}',
        handler: OrganizationController.remove
    });
    server.route({
        method: 'PUT',
        path: '/organizations/{id}',
        handler: OrganizationController.update
    });
}
(async function () {
    try {
        registerRoutes();
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
}());

module.exports = server;