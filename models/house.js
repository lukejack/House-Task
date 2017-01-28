var mongoose = require('mongoose');

var houseSchema = mongoose.Schema({
    name    : String,
    admin   : String,
    icon    : String
});

module.exports = mongoose.model('House', houseSchema);
