let mongoose = require('mongoose');
let House = require('./models/house');
let User = require('./models/user');
let Task = require('./models/task');
let TaskDone = require('./models/taskDone');

function createHouse(name, user, cb) {
    House.findOne({ 'name': name }, function (err, house) {
        if (err) {
            console.log(err);
            cb({ error: 'Database error' });
        }
        if (house) {
            cb({ error: 'House already exists' });
        } else {
            var newHouse = new House();
            newHouse.name = name;
            newHouse.admin = user._id;
            newHouse.save(function (err, createdHouse) {
                if (err) {
                    cb({ error: 'Database error' });
                } else {
                    user.addHouseId(createdHouse._id.toString());
                    cb({ success: 'true' });
                }
            });
        }
    });
}

function addMembers(house, user, members, cb) {
    user.isMember(house, (member) => {
        if (member) {
            House.findOne({ 'admin': user._id, 'name': house }, (err, foundHouse) => {
                if (err) { console.log(err); cb({ error: 'Database error' }); }
                if (foundHouse) {
                    User.find({
                        'email': {
                            $in: members
                        }
                    }, function (err, usersGot) {
                        if (err) { console.log(err); cb({ error: 'Database error' }) }
                        usersGot.forEach((one) => {
                            one.isMember(foundHouse.name, (is)=>{
                                if (!is) one.addHouseId(foundHouse._id.toString());
                            })
                        });
                        cb({ success: true });
                    });
                } else cb({ error: 'You are not the administrator of this house' });
            });
        } else cb({ error: 'You are not a member of this house' });
    });
}

function addTasks(houseName, user, tasks, cb) {
    House.findOne({ 'name': houseName }, (err, house) => {
        if (err) throw err;
        if (house) {
            user.isMember(houseName, (member) => {
                if (member) {
                    tasks.forEach((task) => {
                        var newTask = new Task();
                        newTask.name = task.name;
                        newTask.houseId = house._id.toString();
                        newTask.description = task.description;
                        newTask.difficulty = task.difficulty;
                        newTask.save(function (err) {
                            if (err) throw err;
                        });
                    });
                    cb({ success: true });
                } else cb({ error: 'You are not a member of this house' });
            });
        }
    });

}

/*
function addCompletion(houseId, taskId, userId, time, cb) {

    let house = houseExists(houseId);
    let task = taskExists(taskId);

    if (house && task && user.isMember(house)) {
        var completion = new TaskDone();
        completion.userId = user._id;
        completion.house = houseId;
        completion.task = task._id;
        completion.date = Date.getTime();
        completion.save(function (err) {
            if (err) {
                throw err;
                cb({ error: 'Database error' });
            } else cb({ success: true });
        })

    } else cb({ error: 'You are not a member of this house' });
}*/

function houseExists(houseId) {
    House.findOne({ '_id': ObjectId.fromString(houseId) }, (err, house) => {
        return house ? house : false;
    });
}

function taskExists(taskId) {
    Task.findOne({ '_id': ObjectId.fromString(taskId) }, (err, task) => {
        return task ? task : false;
    });
}
module.exports = { createHouse: createHouse, addMembers: addMembers, addTasks: addTasks };