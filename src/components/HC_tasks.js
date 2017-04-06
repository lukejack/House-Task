import React from 'react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import ObjectTable from './ObjectTable';

let tools = require('../clientTools');

let id = 0;
function genId(){
    return id++;
}

class HC_tasks extends React.Component{
    constructor(props){
        super(props);

        

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
        this.sliderChanged = this.sliderChanged.bind(this);

        this.state = {
            currentInput: '',
            error: false,
            tasksToAdd: [],
            currentDifficulty: 5,
            field: ''
        };
    }

    handleChange(event){
        
        event.persist();
        this.setState((prevState, props)=>{return {currentInput: event.target.value}});
    }

    componentDidMount(){
        this.field.focus();
    }

    submit(){
        const input = this.state.currentInput;
        if (input === '')
        {
            this.setState({
                error: 'There is no text in the box'
            });
        } else if (tools.find(this.state.tasksToAdd, 'name', input)){
            this.setState({error: 'A task by that name already exists'});
        } 
        else
        {
            //Add to structure here
            this.setState((prevState, props)=>{
                let thisTask = {
                    name: prevState.currentInput,
                    difficulty: prevState.currentDifficulty,
                    id: genId()
                };
                let lastTasks = prevState.tasksToAdd;
                lastTasks.push(thisTask)

                return {
                    tasksToAdd: lastTasks
                }
            }
            );
            this.setState({currentInput : '', currentDifficulty: 5});
        }
    }

    handleKeyPress(target) {
        if(target.charCode==13){
            this.submit();
        }
    }

    sliderChanged(input){
        this.setState({currentDifficulty: input.target.value});
    }

    next(){
        this.props.incrementStep();
        this.props.setTasks(this.state.tasksToAdd);
    }

    render(){
        let errorMessage;
        if (this.state.error) {
            errorMessage = this.state.error;
        } else
            errorMessage = '';

        

        return(
            <div>
                <h2>House creation - {this.props.houseName}</h2>
                <h3>
                    Create some tasks for your house
                </h3>
                <h5>
                    You can add more later
                </h5>

                <ObjectTable items={this.state.tasksToAdd} headings={['name', 'difficulty']} delete={(id)=>tools.delete(this, 'tasksToAdd', id)}/>
                
                <label>
                    Task name: 
                    <input type="text" onChange={this.handleChange} value={this.state.currentInput} onKeyPress={this.handleKeyPress} ref={(input)=>{this.field = input;}}/>
                </label>
                <label>
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
                <div>{errorMessage}</div>
                <button type="submit" onClick={this.submit}>Add Task</button>
                <button type="submit" className='submit_button' onClick={this.next}>Finish</button>
            </div>);
    }
}

export default HC_tasks;