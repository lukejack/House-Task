import React from 'react';
import HC_name from './HC_name';
import HC_members from './HC_members';
import HC_tasks from './HC_tasks';
let tools = require('../clientTools');

class HouseCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 0,
            houseName: '',
            members: [],
            tasks: []
        };

        this.incrementStep = this.incrementStep.bind(this);
        this.setHouseName = this.setHouseName.bind(this);
        this.setMembers = this.setMembers.bind(this);
        this.setTasks = this.setTasks.bind(this);
        this.finish = this.finish.bind(this);
    }

    incrementStep() {
        this.setState((prevState, props) => {
            return {
                step: prevState.step + 1
            }
        });
    }

    setHouseName(name) {
        this.setState((prevState, props) => {
            return {
                houseName: name
            }
        });
    }

    setMembers(members) {
        this.setState((prevState, props) => { return { members: members } });
    }

    setTasks(tasks) {
        let tasksToSend = [];
        //Remove ID field from tasks for POST
        for (let i = 0; i < tasks.length; i++)
            tasksToSend[i] = { name: tasks[i].name, difficulty: tasks[i].difficulty };

        console.log(tasksToSend);
        this.setState((prevState, props) => {
            return {
                tasks: tasksToSend
            }
        });

        this.finish();
    }

    finish() {
        //Post the house name, then add members and tasks
        tools.post('/post/housecreate', this, (data, stateRef) => {
            console.log(data);
            if (data.success) {
                tools.post('/post/memberadd', stateRef, (data, stateRef) => {
                    //SUCCESS
                }, 'house=' + stateRef.state.houseName + "&members=" + JSON.stringify(stateRef.state.members));
                tools.post('/post/taskadd', stateRef, (data, stateRef) => {
                    //SUCCESS
                }, 'tasks=' + JSON.stringify(stateRef.state.tasks) + '&house=' + stateRef.state.houseName);
            }
        }, 'house=' + this.state.houseName);
    }

    render() {
        let currentStep;
        switch (this.state.step) {
            case 0:
                currentStep = <HC_name incrementStep={this.incrementStep} setHouseName={this.setHouseName} />;
                break;
            case 1:
                currentStep = <HC_members houseName={this.state.houseName} incrementStep={this.incrementStep} setMembers={this.setMembers} />
                break;
            case 2:
                currentStep = <HC_tasks houseName={this.state.houseName} incrementStep={this.incrementStep} setTasks={this.setTasks} />
                break;
            default:
                currentStep = <p>Illegal step</p>
                break;
        }

        return (
            <div>
                {currentStep}
            </div>
        );
    }
}

export default HouseCreate;