//Component to add tasks to a house

import React from 'react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import ObjectTable from './ObjectTable';

let tools = require('../clientTools');

let id = 0;
function genId() {
    //Generate ID unique to this component
    return id++;
}

class HC_tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentInput: '',
            error: false,
            tasksToAdd: [],
            currentDifficulty: 5,
            field: ''
        };

        //Function bindings
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
        this.sliderChanged = this.sliderChanged.bind(this);
    }

    handleChange(event) {
        //Input text box value changed
        event.persist();
        this.setState((prevState, props) => { return { currentInput: event.target.value } });
    }

    componentDidMount() {
        //Select text input immediately
        this.field.focus();
    }

    submit(cb) {
        const input = this.state.currentInput;
        if (input === '') {
            this.setState({
                error: 'There is no text in the box'
            });
        } else if (tools.find(this.state.tasksToAdd, 'name', input)) {
            this.setState({ error: 'A task by that name already exists' });
        }
        else {
            //Add task to state
            this.setState((prevState, props) => {
                let thisTask = {
                    name: prevState.currentInput,
                    difficulty: prevState.currentDifficulty,
                    id: genId()
                };
                let lastTasks = prevState.tasksToAdd;
                lastTasks.push(thisTask)

                return {
                    tasksToAdd: lastTasks,
                    currentInput: '',
                     currentDifficulty: 5
                }
            }, cb
            );
        }
    }

    handleKeyPress(target) {
        //Submit on enter pressed
        if (target.charCode == 13) {
            this.submit();
        }
    }

    sliderChanged(input) {
        //Difficulty slider callback to set state
        this.setState({ currentDifficulty: input.target.value });
    }

    next() {
        //Go to next determined by parent
        const input = this.state.currentInput;
        if (input === ''){
            this.props.incrementStep();
            this.props.setTasks(this.state.tasksToAdd);
        } else {
            this.submit(()=>{
                this.props.incrementStep();
                this.props.setTasks(this.state.tasksToAdd);
            });
        }
    }

    render() {

        //Display an error if it exists
        let errorMessage;
        if (this.state.error) {
            errorMessage = this.state.error;
        } else
            errorMessage = '';

        return (
            <div className="pad">
                <div className='comp_title'>
                    <h2 className='float_left expand'>Create tasks: {this.props.houseName}</h2>
                </div>
                <h5>
                    You can add more later
                </h5>

                <ObjectTable items={this.state.tasksToAdd} headings={['name', 'difficulty']} delete={(id) => tools.delete(this, 'tasksToAdd', id)} />
                <div className="row">
                    <h6 className="two columns">
                        Name:
                </h6 >
                    <input className="six columns" type="text" onChange={this.handleChange} value={this.state.currentInput} onKeyPress={this.handleKeyPress} ref={(input) => { this.field = input; }} />
                    <label className="three columns">
                        Difficulty (Score): {this.state.currentDifficulty}
                        <ReactBootstrapSlider
                            value={this.state.currentDifficulty}
                            change={this.sliderChanged}
                            step={1}
                            max={10}
                            min={0}
                            orientation="horizontal"
                        />

                    </label>
                </div>
                <div>{errorMessage}</div>
                <button type="submit" onClick={this.submit}>Add Task</button>
                <button type="submit" className='submit_button' onClick={this.next}>Finish</button>
            </div>);
    }
}

export default HC_tasks;