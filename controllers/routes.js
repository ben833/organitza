module.exports = (server) => {
    const Joi = require('joi');
    const OrganizationController =  require('./organization');
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