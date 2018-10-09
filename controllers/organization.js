var Organization = require('../models/organization');

/**
 * Add an organization.
 */
exports.create = (request, h) => {
    const organizationData = {
        name: request.payload.name,
        description: request.payload.description,
        url: request.payload.url,
        code: request.payload.code,
        type: request.payload.type,
    };
    return Organization.create(organizationData).then(organization =>
         h.response({ message: 'success', organization: organization })
             .code(201)
    ).catch((error) => {
        return { err: error };
    });
}

/**
 * List organizations.
 */
exports.list = (request, h) => {
    const params = request.query;
    // If we have query parameters
    if (Object.keys(params).length) {
        let query = {};
        let selectFields = ['name', 'type'];
        if (params.code) {
            query.code = params.code;
            selectFields = [...selectFields, 'code', 'url'];
        }
        if (params.name) {
            query.name = params.name;
        }
        let selectFieldsString = selectFields.join(' ');
        return Organization.find(query, selectFieldsString).exec().then((organizations) => {
            if (organizations && organizations.length) {
                return h.response( organizations );
            }
            else {
                return h.response({ message: 'We could not find that organization.' })
                    .code(404);
            }
        }).catch((error) => {
            console.error(error);
            return h.response({ message: 'There was an error. Please check the logs.' })
                .code(500);
        });
    }
    else {
        return Organization.find({}, 'name').exec().then(organizations => {
            return h.response( organizations );
        }
        ).catch((error) => {
            return { err: error };
        });
    }
}

/**
 * Delete organization.
 */
exports.update = (request, h) => {
    return Organization.findById(request.params.id).exec().then((organization) => {
        if (organization) {
            organization.name = request.payload.name;
            organization.code = request.payload.code;
            organization.url = request.payload.url;
            organization.type = request.payload.type;
            return organization.save(organization).then(() => {
                return h.response({ message: 'success' })
                    .code(200);
            }).catch((error) => {
                console.error(error);
                return h.response({message: 'There was an error. Please check the logs.' })
                    .code(500);
            });
        }
        else {
            return h.response({ message: 'We could not find that organization.' })
                .code(404);
        }
    }).catch((error) => {
        console.error({ message: error.message, stack: error.stack.substring(1, 200) });
        return h.response({ message: 'There was an error. Please check the logs.' })
            .code(500);
    });
}

/**
 * Delete organization.
 */
exports.remove = (request, h) => {
    return Organization.findById(request.params.id).exec().then((organization) => {
        if (organization) {
            return organization.remove().then(() => {
                return h.response({ message: 'success' })
                    .code(200);
            }).catch((error) => {
                console.error(error.message);
                return h.response({ message: 'There was an error. Please check the logs.' })
                    .code(500);
            });
        }
        else {
            return h.response({ message: 'We could not find that organization.' })
                .code(404);
        }
    }).catch((error) => {
        console.error(error.message);
        return h.response({ message: 'There was an error. Please check the logs.' })
            .code(500);
    });
}
