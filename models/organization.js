'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationModel = new Schema({
    name: { type: String, index: true, required: true },
    code: { type: String, index: true },
    description: 'string',
    url: 'string',
});

module.exports = mongoose.model('Organization', organizationModel, 'organizations');
