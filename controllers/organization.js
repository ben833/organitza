var Organization = require('../models/organization');

/**
 * Add an organization.
 */
exports.create = (request, h) => {
    const organizationData = {
        name: request.payload.name,
        description: request.payload.description,
        url: request.payload.url,
        code: request.payload.code
    };
    Organization.create(organizationData).then(organization =>
         h.response({ message: 'Organization created successfully', organization: organization })
             .code(201)
    ).catch((error) => {
        return { err: error };
    });
}

/**
 * List organizations.
 */
exports.list = (request, h) => {
    Organization.find({}).exec().then(organization =>
        h.response({ organizations: organization })
    ).catch((error) => {
        return { err: error };
    });
}

/**
 * Delete organization.
 */
exports.remove = (request, h) => {
    Organization.findById(request.params.id).exec((error, organization) => {
        if (error) {
            console.error(error);
            h.response({ message: 'There was an error. Please check the logs.' })
                .status(500);
        }
        else if (!organization) {
            h.response({ message: 'We could not find that organization.' });
        }
        else {
            organization.remove(error => {
                if (error) {
                    console.error(error);
                    h.response({ message: 'There was an error. Please check the logs.' })
                        .status(500);
                }
                else {
                    h.response({ success: true })
                }
            })
        }
    });
}
