const Schema = require('mongoose').Schema;

module.exports = new Schema({
    URL: {
        type: String,
        required: true,
    },
    password: String,
    length: String,
    owner: String,
    created: {
        type: Date,
        default: Date.now
    } 
}, { collection : 'URLPasswordManagement2024' });