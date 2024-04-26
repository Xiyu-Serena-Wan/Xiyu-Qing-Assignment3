const Schema = require('mongoose').Schema;
// var mongoose = require('mongoose');

module.exports = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    // favoriteColor: Number, // {type: String}
    created: {
        type: Date,
        default: Date.now
    },
    sharedByUsers: 
    {
        type: [String],
    },

}, { collection : 'userSpr2024' });