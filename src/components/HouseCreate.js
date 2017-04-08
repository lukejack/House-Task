import React from 'react';
import HC_name from './HC_name';
import HC_members from './HC_members';
import HC_tasks from './HC_tasks';
var base64url = require('base64-url');
let tools = require('../clientTools');
var Loader = require('halogen/MoonLoader');
var spinner_css = require('../react-styles.js').spinner;

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
        this.setImage = this.setImage.bind(this);
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
        this.setState((prevState, props) => {
            return {
                tasks: tasksToSend
            }
        });
        this.finish(tasksToSend);
    }

    setImage(file) {
        this.setState({ image: file });
    }

    finish(tasks) {
        //Post the house name, then add members, tasks and the image 64
        this.setState({ step: 'Spinner' });
        tools.post('/post/housecreate', this, (data, stateRef) => {
            if (data.success) {
                setTimeout(() => {
                    if (stateRef.state.image) {
                        tools.post('/post/imageadd', stateRef, (data, stateRef) => {
                        }, 'house=' + stateRef.state.houseName + '&image=' + base64url.escape(stateRef.state.image));
                    }
                    tools.post('/post/memberadd', stateRef, (data, stateRef) => {
                        if (data.error) {
                            alert('Member add error: ', data.error);
                        }
                    }, 'house=' + stateRef.state.houseName + "&members=" + JSON.stringify(stateRef.state.members));
                    tools.post('/post/taskadd', stateRef, (data, stateRef) => {
                        if (data.success) {
                            window.location.reload();
                        } else {
                            alert('Task add error: ', data.error);
                        }
                    }, 'tasks=' + JSON.stringify(tasks) + '&house=' + stateRef.state.houseName);
                    alert('House created. You can select this house from the drop down menu at the bottom of site');
                }, 4000);
            } else {
                alert(data.error ? data.error : 'Unfortunately, we were unable to create your house at this time. Please try again later');
            }
        }, 'house=' + this.state.houseName);

    }

    render() {
        let currentStep;
        switch (this.state.step) {
            case 0:
                currentStep = <HC_name incrementStep={this.incrementStep} setHouseName={this.setHouseName} setImage={this.setImage} />;
                break;
            case 1:
                currentStep = <HC_members houseName={this.state.houseName} incrementStep={this.incrementStep} setMembers={this.setMembers} />;
                break;
            case 2:
                currentStep = <HC_tasks houseName={this.state.houseName} incrementStep={() => { }} setTasks={this.setTasks} />;
                break;
            default:
                currentStep = <div style={spinner_css}><Loader color={'#000000'} /></div>;
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