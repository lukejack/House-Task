var mongoose = require('mongoose');

var taskDoneSchema = mongoose.Schema({
    userId: String,
    houseId: String,
    taskId: String,
    date: Number
});

module.exports = mongoose.model('TaskDone', taskDoneSchema);
