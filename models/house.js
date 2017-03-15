var mongoose = require('mongoose');

var houseSchema = mongoose.Schema({
    name    : String,
    admin   : String,
    icon    : String
});

houseSchema.methods.isAdmin = function(id){
    return this.admin === id;
}

houseSchema.methods.addIcon = function (base64) {
    this.icon = base64;
    this.save();
}

module.exports = mongoose.model('House', houseSchema);
