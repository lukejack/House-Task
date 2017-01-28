var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    email       : String,
    password    : String,
    fname       : String,
    lname       : String,
    houses      : [String]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.addHouse = function(name){
    this.houses.push(name);
    this.save();
}

userSchema.methods.isMember = function(houseName){
    foreach (house in this.houses)
    {
        if (house == houseName)
            return true;
    }
    return false;
}

module.exports = mongoose.model('User', userSchema);
