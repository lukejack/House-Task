var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
let House = require('./house');

var userSchema = mongoose.Schema({
    email: String,
    password: String,
    fname: String,
    lname: String,
    houseIds: [String]
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.addHouseId = function (id) {
    this.houseIds.push(id);
    this.save();
};

userSchema.methods.removeHouseId = function (id) {
    for (let i = 0; i < this.houseIds.length; i++){
        if (this.houseIds[i] == id){
            this.houseIds.splice(i, 1);
        }
    }
};

userSchema.methods.isMember = function (houseName, cb) {
    let found = false;
    this.getHouseNames((houses) => {
        houses.forEach(function (house) {
            if (house === houseName)
                found = true;
        });
        cb(found);
    });
};

userSchema.methods.getHouseNames = function (cb) {
    let houseIds = [];
    let houseIdsString = this.houseIds;
    houseIdsString.forEach((id) => {
        houseIds.push(new mongoose.Types.ObjectId(id));
    });
    let houseNames = [];
    House.find({
        '_id': {
            $in: houseIds
        }
    }, function (err, houses) {
        if (err) throw err
        else {
            houses.forEach((house) => {
                houseNames.push(house.name);
            });
            cb(houseNames);
        }
    });
};

module.exports = mongoose.model('User', userSchema);
