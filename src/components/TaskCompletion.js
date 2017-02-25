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
        tools.post('/post/taskcomplete', this, (data, stateRef) => {
            console.log('Response from completion: ', data);
        }, 'houseId=' + this.props.houseId + '&taskId=' + this.state.selectedTask + '&description=' + this.state.inputText);
        this.props.refresh();
    }

    showTaskCreation(){
        this.setState({newTasks: true});
    }

    taskCreationFinished(tasks){
        tools.post('/post/taskadd', this, (data, stateRef) => {
        }, 'tasks=' + JSON.stringify(tasks) + '&house=' + this.props.house);
        this.setState({newTasks: false});
        this.props.refresh();
    }

    taskChange(event) {
        this.setState({ selectedTask: event.target.value });
    }

    render() {
        let errorMessage = this.state.error ? this.state.error : '';
        let tasklist = (this.props.tasks && this.props.tasks.length > 0) ? this.props.tasks.map((task) => <option key={task._id} value={task._id}>{task.name}</option>) : <span>Loading...</span>;
        if (this.state.newTasks) return (<HC_tasks houseName={this.props.house} incrementStep={() => { } } setTasks={this.taskCreationFinished} />)
        else
            return (
                <div>
                    <h2>Task Completion</h2>
                    <div className='row'>
                        <h4 className='three columns'>Task</h4>
                        <select name='houses' className='nine columns' onChange={this.taskChange}>
                            {tasklist}
                        </select>
                    </div>
                    <div className='row'>
                        <h4 className='four columns'>Description</h4>
                        <input className='eight columns' type="text" onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref={(input) => { this.field = input; } } />
                    </div>
                    <div>{errorMessage}</div>
                    <div className='row'>
                        <button type="submit" onClick={this.submit}>Submit</button>
                        <button type="submit" onClick={this.showTaskCreation}>Create a new task</button>
                    </div>
                </div>
            );
    }
}

export default TaskCompletion;