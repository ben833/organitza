// Test the addition, searching and removal of organizations
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Organization = require('../models/organization');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Organizations', () => {
    beforeEach((done) => { //Before each test we empty the database
        Organization.remove({}, (error) => {
            done();
        });
    });
    /*
      * Test the /GET route
      */
    describe('/GET organization', () => {
        it('it should GET all the organizations', (done) => {
            chai.request(server)
                .get('/organizations')
                .end((error, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

});