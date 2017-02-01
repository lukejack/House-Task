var mongoose = require('mongoose');

var taskSchema = mongoose.Schema({
    name        : String,
    house       : String,
    description : String,
    difficulty  : Number
});

module.exports = mongoose.model('Task', taskSchema);
