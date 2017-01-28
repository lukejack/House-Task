var mongoose = require('mongoose');

var taskDoneSchema = mongoose.Schema({
    email       : String,
    house       : String,
    task        : String,
    date        : Date
});

module.exports = mongoose.model('TaskDone', taskDoneSchema);
