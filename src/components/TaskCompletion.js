import React from 'react';
let tools = require('../clientTools');

class TaskCompletion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: '',
            error: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.taskChange = this.taskChange.bind(this);
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
        this.setState({selectedTask: (this.props.tasks.length > 0) ? this.props.tasks[0]._id : null});
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

    }

    taskChange(event) {
        this.setState({ selectedTask: event.target.value });
    }

    render() {
        let errorMessage = this.state.error ? this.state.error : '';
        let tasklist = this.props.tasks.map((task) => <option key={task._id} value={task._id}>{task.name}</option>);

        return (

            <div>
                <h2>Task Completion</h2>
                <h4>Task</h4>
                <select name='houses' className='four columns' onChange={this.taskChange}>
                    {tasklist}
                </select>
                <h4>Description</h4><input type="text" onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref={(input) => { this.field = input; } } />
                <div>{errorMessage}</div>
                <button type="submit" onClick={this.submit}>Submit</button>
            </div>
        );
    }
}

export default TaskCompletion;