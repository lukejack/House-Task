import React from 'react';
let tools = require('../clientTools');

class TaskCompletion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
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
    }

    submit() {
        const input = this.state.inputText;
        if (input === '')
            this.setState({ error: 'Enter a name into the box' });
        else {

        }

    }

    render() {
        let errorMessage = this.state.error ? this.state.error : '';

        return (

            <div>
                <h2>Task Completion</h2>
                <h4>Description<input type="text" onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref={(input) => { this.field = input; }} /></h4>
                <div>{errorMessage}</div>
                <button type="submit" onClick={this.submit}>Next</button>
            </div>
            );
    }
}

export default TaskCompletion;