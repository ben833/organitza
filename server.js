'use strict';

// Node modules
const Hapi = require('hapi');
const Joi = require('joi');
const mongoose = require('mongoose');

// Data
const OrganizationController =  require('./controllers/organization');
const MongoDBUrl = 'mongodb://organitza:F34g8*Lob29!hey@ds125453.mlab.com:25453/organitza';

const server = new Hapi.Server({ port: process.env.PORT || 8080 });

const registerRoutes = () => {
    server.route({
        method: 'GET',
        path: '/v1/organizations',
        handler: OrganizationController.list,
    });
    server.route({
        method: 'POST',
        path: '/v1/organizations',
        handler: OrganizationController.create,
        options: {
            validate: {
                payload: Joi.object().keys({
                    name: Joi.string().required(),
                    description: Joi.string().optional(),
                    code: Joi.string().required(),
                    url: Joi.string().optional(),
                    type: Joi.string().valid('employer', 'insurance', 'health system'),
                }),
            },
        },
    });
    server.route({
        method: 'DELETE',
        path: '/v1/organizations/{id}',
        handler: OrganizationController.remove,
    });
    server.route({
        method: 'PUT',
        path: '/v1/organizations/{id}',
        handler: OrganizationController.update,
        options: {
            validate: {
                payload: Joi.object().keys({
                    name: Joi.string().required(),
                    description: Joi.string().optional(),
                    code: Joi.string().required(),
                    url: Joi.string().optional(),
                    type: Joi.string().valid('employer', 'insurance', 'health system'),
                }),
            },
        },
    });
}
const startServers = async () => {
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
}
startServers();

module.exports = server;