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
                            one.isMember(foundHouse.name, (is) => {
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
                    let tasksToReturn = [];
                    tasks.forEach((task) => {
                        var newTask = new Task();
                        newTask.name = task.name;
                        newTask.houseId = house._id.toString();
                        newTask.description = task.description;
                        newTask.difficulty = task.difficulty;
                        newTask.save(function (err) {
                            if (err) throw err;
                            tasksToReturn.push(newTask);
                            if (tasksToReturn.length === tasks.length){
                                cb({ success: true , tasks: tasksToReturn});
                            }
                        });
                    });
                } else cb({ error: 'You are not a member of this house' });
            });
        }
    });

}

function addImage(houseName, user, image, cb) {
    House.findOne({ 'name': houseName }, (err, house) => {
        if (err) throw err;
        if (house) {
            user.isMember(houseName, (member) => {
                if (member) {
                    house.addIcon(image);
                    cb({ success: true });
                } else cb({ error: 'You are not a member of this house' });
            });
    } else cb({error: 'Unable to find that house'});
    });

}


function addCompletion(houseId, taskId, user, description, cb) {
    House.findOne({ '_id': mongoose.Types.ObjectId(houseId) }, (err, house) => {
        user.isMember(house.name, (is) => {
            Task.findOne({ '_id': mongoose.Types.ObjectId(taskId) }, (err, task) => {
                let date = new Date();
                if ((house && task) && is) {
                    let completion = new TaskDone();
                    completion.userId = user._id.toString();
                    completion.houseId = house._id.toString();
                    completion.taskId = task._id.toString();
                    completion.date = date.getTime();
                    completion.description = description;

                    let niceCompletion = {
                        fname: user.fname,
                        lname: user.lname,
                        userId: user._id.toString(),
                        name: task.name,
                        difficulty: task.difficulty,
                        date: completion.date,
                        description: completion.description,
                        _id: completion._id
                    };
                    completion.save(function (err) {
                        if (err) {
                            throw err;
                            cb({ error: 'Database error' });
                        } else cb({ success: true , completion: niceCompletion});
                    });

                } else cb({ error: 'Invalid house or task' });
            });
        });
    });

}

function getCompletions(houseId, user, cb) {
    House.findOne({ '_id': mongoose.Types.ObjectId(houseId) }, (err, house) => {
        user.isMember(house.name, (is) => {
            if (house && is) {
                TaskDone.find({ 'houseId': houseId }, (err, completions) => {

                    if (err) cb({ error: 'Database error' });
                    if (!completions) cb({ error: 'No data' });
                    let taskIds = [];
                    let userIds = [];
                    for (let i = 0; i < completions.length; i++) {
                        let thisTaskId = mongoose.Types.ObjectId(completions[i].taskId);
                        let thisUserId = mongoose.Types.ObjectId(completions[i].userId);
                        if (!includes(thisTaskId))
                            taskIds.push(thisTaskId);
                        if (!includes(thisUserId))
                            userIds.push(thisUserId);
                    }
                    User.find({
                        '_id': {
                            $in: userIds
                        }
                    }, function (err, users) {
                        if (err) { console.log(err); cb({ error: 'Database error' }) }
                        Task.find({
                            '_id': {
                                $in: taskIds
                            }
                        }, function (err, tasks) {
                            if (err) { console.log(err); cb({ error: 'Database error' }) }

                            let niceCompletions = [];
                            for (let i = 0; i < completions.length; i++) {
                                let thisNiceCompletion = {};
                                users.forEach((user) => {
                                    if (completions[i].userId === user._id.toString()) {
                                        thisNiceCompletion.fname = user.fname;
                                        thisNiceCompletion.lname = user.lname;
                                        thisNiceCompletion.userId = user._id.toString();
                                    }
                                });

                                tasks.forEach((task) => {
                                    if (completions[i].taskId === task._id.toString()) {
                                        thisNiceCompletion.name = task.name;
                                        thisNiceCompletion.difficulty = task.difficulty;
                                    }
                                });

                                thisNiceCompletion.date = completions[i].date;
                                thisNiceCompletion.description = completions[i].description;
                                thisNiceCompletion._id = completions[i]._id;

                                niceCompletions.push(thisNiceCompletion);
                            }
                            cb(niceCompletions);
                        });
                    });

                });
            } else cb({ error: 'The user is not a member of that house' })
        });
    });
}

function includes(arr, item){
    for (let i = 0; i < arr.length; i++)
        if (arr[i] === item)
            return true
    return false
}

module.exports = { createHouse: createHouse, addMembers: addMembers, addTasks: addTasks, addCompletion: addCompletion, getCompletions: getCompletions, addImage: addImage };