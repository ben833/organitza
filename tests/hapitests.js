'use strict';

// required modules for testing
const Code        = require('code');
const expect      = Code.expect;
const Lab         = require('lab');
const lab         = exports.lab = Lab.script();

const describe    = lab.describe;
const it          = lab.it;
const before      = lab.before;
const after       = lab.after;

let mongoose = require('mongoose');
let Organization = require('../models/organization');

// require hapi server
const Server = require('../server.js');

const fillWithData = () => {
    return new Promise(async (resolve, reject) => {
        // Delete all the data and start fresh.
        await Organization.deleteMany({}, (error) => {
            if (error) {
                reject(error);
            }
        });

        // Add some records to the DB simultaneously.
        Promise.all([
            new Organization({
                name: 'University of Rochester',
                description: 'U of R Health System',
                code: 'UR',
                type: 'health system',
                url: 'http://waterboy.com',
            }).save(),
            new Organization({
                name: 'Aetna',
                description: 'Health insurance company based in Hartford',
                code: 'aetna',
                type: 'insurance',
                url: 'http://aetna.com',
            }).save(),
            new Organization({
                name: 'United Healthcare of Arizona',
                description: 'Health insurance company based in Phoenix',
                code: 'united',
                type: 'insurance',
                url: 'http://az-united.com',
            }).save(),
            new Organization({
                name: 'United Healthcare of California',
                description: 'Health insurance company based in Sacramento',
                code: 'united',
                type: 'insurance',
                url: 'http://ca-united.com',
            }).save(),
            new Organization({
                name: 'Oxford',
                description: 'Health insurance company based in Hartford',
                code: 'oxford',
                type: 'insurance',
                url: 'http://oxford.com',
            }).save()
        ]).then(() => {
            resolve();
        }).catch(reason => {
            reject(reason);
        });
    });
}

// tests

describe('functional tests - read', () => {
    before(async () => {
        await fillWithData();
    });
    it('should get all organizations', async () => {
        // make API call to self to test functionality end-to-end
        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations',
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.array();
        expect(response.result).to.have.length(5);
        expect(response.result[0].code).to.not.exist();
        expect(response.result[0].url).to.not.exist();
    });

    it('should get one organization by code', async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations?code=UR',
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.array();
        expect(response.result).to.have.length(1);
        expect(response.result[0].code).to.exist();
        expect(response.result[0].code).to.equal('UR');
        expect(response.result[0].url).to.exist();
    });

    it('should get one organization by name', async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations?name=University of Rochester',
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.array();
        expect(response.result).to.have.length(1);
        expect(response.result[0].name).to.equal('University of Rochester');
        expect(response.result[0].code).to.not.exist();
        expect(response.result[0].url).to.not.exist();
    });

    it('should get one organization by name and code; name is used when both are passed',
        async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations?name=Aetna&code=aetna',
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.array();
        expect(response.result).to.have.length(1);
        expect(response.result[0].name).to.equal('Aetna');
        expect(response.result[0].code).to.exist();
        expect(response.result[0].url).to.exist();
    });

    it('should get multiple organization by code', async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations?code=united',
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.an.array();
        expect(response.result.length).to.be.above(1);
        expect(response.result[0].code).to.exist();
        expect(response.result[0].url).to.exist();
    });

    it('should return error for getting with invalid code or name', async () => {

        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations?code=asdf',
        });

        expect(response.statusCode).to.equal(404);
    });
});


describe('functional tests - create', () => {


    it('should return an error for creating with invalid type', async () => {

        const response = await Server.inject({
            method: 'POST',
            url: `/v1/organizations`,
            payload: JSON.stringify({
                name: 'Grayzee Healthcare',
                description: 'Health insurance company based in Springfield',
                code: 'grayzee',
                url: 'http://grayzee.com',
                type: 'band',
            }),
        });

        expect(response.statusCode).to.equal(400);
    });

    it('should return success after creating record', async () => {

        const response = await Server.inject({
            method: 'POST',
            url: '/v1/organizations',
            payload: JSON.stringify({
                name: 'United Healthcare',
                description: 'Health insurance company based in Hartford',
                type: 'insurance',
                code: 'united',
                url: 'http://unitedhealth.com',
            }),
        });

        expect(response.statusCode).to.equal(201);
    });
});

describe('functional tests - update', () => {
    var organizationID = null;
    before(async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations?code=oxford'
        });
        organizationID = response.result[0]._id;
    });

    it('should return an error for updating with ID in system with invalid type', async () => {

        const response = await Server.inject({
            method: 'PUT',
            url: `/v1/organizations/${organizationID}`,
            payload: JSON.stringify({
                name: 'Woweee Healthcare',
                description: 'Health insurance company based in Springfield',
                code: 'wowee',
                url: 'http://woweee.com',
                type: 'x',
            }),
        });

        expect(response.statusCode).to.equal(400);
    });

    it('should return success for updating with ID in system', async () => {

        const response = await Server.inject({
            method: 'PUT',
            url: `/v1/organizations/${organizationID}`,
            payload: JSON.stringify({
                name: 'Woweee Healthcare',
                description: 'Health insurance company based in Springfield',
                code: 'wowee',
                url: 'http://woweee.com',
                type: 'insurance',
            }),
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.message).to.exist();
        expect(response.result.message).to.contain('success');
    });

    it('should return error for updating with ID not in system', async () => {

        const response = await Server.inject({
            method: 'PUT',
            url: `/v1/organizations/5bbc3a48c1d3d50996540459`,
            payload: JSON.stringify({
                name: 'United Healthcare',
                description: 'Health insurance company based in Springfield',
                code: 'united',
                url: 'http://uh.com',
                type: 'insurance',
            }),
        });

        expect(response.statusCode).to.equal(404);
    });

    it('should return error for invalid id format (validation test)', async () => {

        const response = await Server.inject({
            method: 'PUT',
            url: `/v1/organizations/0`,
            payload: JSON.stringify({
                name: 'United Healthcare',
                description: 'Health insurance company based in Springfield',
                code: 'united',
                url: 'http://uh.com',
                type: 'insurance',
            }),
        });

        expect(response.statusCode).to.equal(500);
    });

});

describe('functional tests - delete', () => {
    var organizationID = null;
    before(async () => {
        const response = await Server.inject({
            method: 'GET',
            url: '/v1/organizations?code=aetna',
        });
        organizationID = response.result[0]._id;
    });

    it('should return success for deleting with ID in system', async () => {

        const response = await Server.inject({
            method: 'DELETE',
            url: `/v1/organizations/${organizationID}`
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result.message).to.exist();
        expect(response.result.message).to.contain('success');
    });

    it('should return error for deleting with ID not in system', async () => {

        const response = await Server.inject({
            method: 'DELETE',
            url: '/v1/organizations/5bbc3a48c1d3d50996540459',
        });

        expect(response.statusCode).to.equal(404);
    });

    it('should return error for invalid id format (validation test)', async () => {

        const response = await Server.inject({
            method: 'DELETE',
            url: '/v1/organizations/0',
        });

        expect(response.statusCode).to.equal(500);
    });
    after(async () => {
        Server.stop({timeout: 10000}).then(function (err) {
            console.log('hapi server stopped')
            process.exit((err) ? 1 : 0)
        })
    });
});

describe('functional tests - get documentation', () => {

/*
    it('should return documentation html', async () => {

        // make API call to self to test functionality end-to-end
        const response = await Server.inject({
            method: 'GET',
            url: '/',
        });

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.be.a.string();
    });
    after(async () => {
        Server.stop({timeout: 10000}).then(function (err) {
            console.log('hapi server stopped')
            process.exit((err) ? 1 : 0)
        })
    });

*/
});
