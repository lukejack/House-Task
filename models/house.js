var mongoose = require('mongoose');

var houseSchema = mongoose.Schema({
    name    : String,
    admin   : String,
    icon    : String
});

houseSchema.methods.isAdmin = function(id){
    return this.admin === id;
}

module.exports = mongoose.model('House', houseSchema);
