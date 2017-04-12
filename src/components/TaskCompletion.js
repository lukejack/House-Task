//Page for submitting a task completion

import React from 'react';
import HC_tasks from './HC_tasks';
var Loader = require('halogen/MoonLoader');
var spinner_css = require('../react-styles.js').spinner;
let tools = require('../clientTools');

class TaskCompletion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: '',
            error: false,
            newTasks: false
        };

        //Function bindings
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.taskChange = this.taskChange.bind(this);
        this.showTaskCreation = this.showTaskCreation.bind(this);
        this.taskCreationFinished = this.taskCreationFinished.bind(this);
    }

    handleChange(event) {
        //Description input changed text
        this.setState({ inputText: event.target.value });
    }

    handleKeyPress(target) {
        //Enter button submission key shortcut
        if (target.charCode == 13) {
            this.submit();
        }
    }

    componentWillReceiveProps(nextProps) {
        //Properties changed (new task added, select this newly added task)
        this.setState({ selectedTask: (this.props.tasks.length > 0) ? this.props.tasks[this.props.tasks.length - 1]._id : undefined });
    }

    componentDidMount() {
        //Set the selected task if any tasks exist
        this.setState({ selectedTask: (this.props.tasks.length > 0) ? this.props.tasks[0]._id : undefined });
    }

    submit() {
        const input = this.state.inputText;
        if (this.state.selectedTask !== undefined) {
            //Send to server
            if (this.props.tasks.length === 1) {
                tools.post('/post/taskcomplete', this, (data, stateRef) => {
                }, 'houseId=' + this.props.houseId + '&taskId=' + this.props.tasks[0]._id + '&description=' + this.state.inputText);
            } else
                tools.post('/post/taskcomplete', this, (data, stateRef) => {
                }, 'houseId=' + this.props.houseId + '&taskId=' + this.state.selectedTask + '&description=' + this.state.inputText);
            //Reload the page
            location.reload();
        }
    }

    showTaskCreation() {
        //Change state to task creation mode
        this.setState({ newTasks: true });
    }

    taskCreationFinished(tasks) {
        //Add new tasks to server and sync these new tasks with the client
        tools.post('/post/taskadd', this, (data, stateRef) => {
            if (data.success) {
                this.props.addTasks();
            }
        }, 'tasks=' + JSON.stringify(tasks) + '&house=' + this.props.house);

        //Go back to normal mode displaying completion submission
        this.setState({ newTasks: false });
    }

    taskChange(event) {
        //New task selected from the dropdown
        this.setState({ selectedTask: event.target.value });
    }

    render() {
        //Display an error message if it exists
        let errorMessage = this.state.error ? this.state.error : '';
        
        //Map tasks to the drop down box
        let tasklist = (this.props.tasks && this.props.tasks.length > 0) ? this.props.tasks.map((task) => <option key={task._id} value={task._id}>{task.name}</option>) : <option></option>;
        
        //Display task creation if it has been selected
        if (this.state.newTasks) return (<HC_tasks houseName={this.props.house} incrementStep={() => { }} setTasks={this.taskCreationFinished} />)
        else
            return (
                <div className="pad">
                    <div className='comp_title'>
                        <h2 className='float_left expand'>Submit Task: {this.props.house}</h2>
                    </div>
                    <div className='row'>
                        <h4 className='two columns'>Task</h4>
                        <select name='houses' value={this.state.selectedTask} className='seven columns' onChange={this.taskChange}>
                            {tasklist}
                        </select>
                        <button className='three columns' type="submit" onClick={this.showTaskCreation}>New Task</button>
                    </div>
                    <div className='row'>
                        <h5 className='three columns'>Comment</h5>
                        <input className='nine columns' type="text" onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref={(input) => { this.field = input; }} />
                    </div>
                    <div>{errorMessage}</div>
                    <div className='row'>
                        <button type="submit" className='nine columns submit_button' onClick={this.submit}>Submit</button>
                        <button type="submit" className='three columns' onClick={() => { alert('First you must create tasks using the New Task button, then select your task from the drop down and click submit. The description is visible by clicking on the completion under Completions'); }}>Help</button>
                    </div>
                </div>
            );
    }
}

export default TaskCompletion;