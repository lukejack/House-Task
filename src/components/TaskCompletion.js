import React from 'react';
import HC_tasks from './HC_tasks';
let tools = require('../clientTools');

class TaskCompletion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: '',
            error: false,
            newTasks: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.taskChange = this.taskChange.bind(this);
        this.showTaskCreation = this.showTaskCreation.bind(this);
        this.taskCreationFinished = this.taskCreationFinished.bind(this);
    }

    handleChange(event) {
        this.setState({ inputText: event.target.value });
    }

    handleKeyPress(target) {
        if (target.charCode == 13) {
            this.submit();
        }
    }

    componentDidMount() {
        this.field.focus();
        this.setState({ selectedTask: (this.props.tasks.length > 0) ? this.props.tasks[0]._id : null });
    }

    submit() {
        const input = this.state.inputText;
        /*
        if (input === '')
            this.setState({ error: 'Please enter a short description' });
        else {

        }*/
        if (this.props.tasks.length === 1) {
            tools.post('/post/taskcomplete', this, (data, stateRef) => {
                console.log('Response from completion: ', data);
            }, 'houseId=' + this.props.houseId + '&taskId=' + this.props.tasks[0]._id + '&description=' + this.state.inputText);
        } else
            tools.post('/post/taskcomplete', this, (data, stateRef) => {
                console.log('Response from completion: ', data);
            }, 'houseId=' + this.props.houseId + '&taskId=' + this.state.selectedTask + '&description=' + this.state.inputText);
        location.reload();
    }

    showTaskCreation() {
        this.setState({ newTasks: true });
    }

    taskCreationFinished(tasks) {
        tools.post('/post/taskadd', this, (data, stateRef) => {
            if (data.success) {
                console.log('Success adding task');
                this.props.addTasks();
            }
        }, 'tasks=' + JSON.stringify(tasks) + '&house=' + this.props.house);
        this.setState({ newTasks: false });

    }

    taskChange(event) {
        this.setState({ selectedTask: event.target.value });
    }

    render() {
        console.log('Tasks in inner render: ', this.props.tasks);
        let errorMessage = this.state.error ? this.state.error : '';
        let tasklist = (this.props.tasks && this.props.tasks.length > 0) ? this.props.tasks.map((task) => <option key={task._id} value={task._id}>{task.name}</option>) : <span>Loading...</span>;
        if (this.state.newTasks) return (<HC_tasks houseName={this.props.house} incrementStep={() => { }} setTasks={this.taskCreationFinished} />)
        else
            return (
                <div className="pad">
                    <div className='comp_title'>
                        <h2 className='float_left expand'>Submit Task: {this.props.house}</h2>
                    </div>
                    <div className='row'>
                        <h4 className='two columns'>Task</h4>
                        <select name='houses' className='seven columns' onChange={this.taskChange}>
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