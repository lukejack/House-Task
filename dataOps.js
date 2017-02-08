let mongoose = require('mongoose');
let House = require('./models/house');
let User = require('./models/user');
let Task = require('./models/task');

function createHouse(name, user, cb) {
    House.findOne({ 'name': name }, function (err, house) {
        if (err) {
            console.log(err);
            cb({ error: 'Database error' });
        }
        console.log('If house...');
        console.log(house);
        if (house) {
            cb({ error: 'House already exists' });
        } else {
            var newHouse = new House();
            newHouse.name = name;
            newHouse.admin = user._id;
            newHouse.save(function (err) {
                if (err) {
                    cb({ error: 'Database error' });
                } else {
                    user.addHouse(name);
                    cb({ success: 'true' });
                }
            });
        }
    });
}

function addMembers(house, user, members, cb) {
    if (user.isMember(house)) {
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
                        if (!one.isMember(house))
                            one.addHouse(house);
                    });
                    cb({ success: true });
                });
            } else cb({ error: 'You are not the administrator of this house' });
        });
    } else cb({ error: 'You are not a member of this house' });
}

function addTasks(house, user, tasks, cb) {
    if (user.isMember(house)) {
        tasks.forEach((task) => {
            var newTask = new Task();
            newTask.name = task.name;
            newTask.house = house;
            newTask.description = task.description;
            newTask.difficulty = task.difficulty;
            newTask.save(function (err) {
                if (err) throw err;
            });
        });
        cb({success: true});
    } else cb({ error: 'You are not a member of this house' });
}
module.exports = { createHouse: createHouse, addMembers: addMembers, addTasks: addTasks };