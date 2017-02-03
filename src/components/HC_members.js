import React from 'react';
let tools = require('../clientTools');
import ObjectTable from './ObjectTable';

let id = 0;

function genId(){
    return id++;
}

class HC_members extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            houseName: this.props.houseName,
            currentInput: '',
            membersToAdd: [],
            userExists: true,
            error: false,
            field: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
        this.undo = this.undo.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
    }

    handleChange(event){
        
        event.persist();
        this.setState((prevState, props)=>{return {currentInput: event.target.value}});
    }

    componentDidMount(){
        this.field.focus();
    }

    submit(){
        if (this.state.currentInput == '')
        {
            this.setState({
                error: 'There is no text in the box'
            });
        } else
        tools.get('/json/getuser/' + this.state.currentInput, this, function(data, stateRef){
            if (data.error)
                stateRef.setState((prevState, props)=>{return {error: data.error}});
            else
                {
                    stateRef.setState((prevState, props)=>{
                        let currentMembers = prevState.membersToAdd;
                        currentMembers.push({email: prevState.currentInput, fname: data.fname, lname: data.lname, id: genId()});
                        
                        return {
                            membersToAdd: currentMembers,
                            error: false
                        }
                    });
                    stateRef.setState({currentInput : ''})
                }
        });
    }

    handleKeyPress(target) {
        if(target.charCode==13){
            this.submit();
        }
    }

    next(){
        this.props.incrementStep();
        this.props.setMembers(this.state.membersToAdd);
    }

    undo(){
        this.setState((prevState, props)=>{
            return{
                membersToAdd: prevState.membersToAdd.length > 1 ? prevState.membersToAdd.splice(0, 1) : []
        }});
    }

    deleteMember(id){
        this.setState((prevState, props)=>{
            let i = prevState.membersToAdd.length;
            let newMembers = prevState.membersToAdd;
            while (i--){
                if (prevState.membersToAdd[i].id === id){
                    newMembers.splice(i, 1);
                }
            }
            return {
                membersToAdd: newMembers
            };
        });
    }

    render(){
        

        let errorMessage;

        if (this.state.error) {
            errorMessage = this.state.error;
        } else
            errorMessage = '';
        
        return(
            <div>
                
                <h2>House creation - {this.state.houseName}</h2>
                <h3>
                    Add people to this house
                </h3>
                <h5>
                    (You can add more later)
                </h5>
                <ObjectTable items={this.state.membersToAdd} headings={['fname', 'email']} delete={(id)=>this.deleteMember(id)}/>
                <label>
                    User's email: 
                    <input type="text" onChange={this.handleChange} value={this.state.currentInput} onKeyPress={this.handleKeyPress} ref={(input)=>{this.field = input;}}/>
                <button type="submit" onClick={this.submit}>Submit</button>
                
                <div>{errorMessage}</div>
                </label>
                <button type="submit" onClick={this.next}>Next</button>
            </div>);
    }
}

export default HC_members;