import React from 'react';
let tools = require('../clientTools');

class HC_tasks extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            houseName: this.props.houseName,
            currentInput: '',
            membersToAdd: [],
            userExists: true,
            field: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
    }

    handleChange(event){
        
        event.persist();
        this.setState((prevState, props)=>{return {currentInput: event.target.value}});
    }

    componentDidMount(){
        this.field.focus();
    }

    submit(){
        this.setState({userExists: true});
        tools.get('/json/getuser/' + this.state.currentInput, this, function(data, stateRef){
            if (data.exists == false)
            {
                stateRef.setState((prevState, props)=>{return {userExists: false, lastFailed: prevState.currentInput}});
            }
            else
                {
                    stateRef.setState((prevState, props)=>{
                        let currentMembers = prevState.membersToAdd;
                        currentMembers.push({email: prevState.currentInput, fname: data.fname, lname: data.lname});
                        
                        return {
                            membersToAdd: currentMembers
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

    render(){
        
        let memberNames = this.state.membersToAdd.map((member)=><h4>{member.fname + ' ' + member.lname}</h4>);
        return(
            <div>
                <div>{this.state.userExists ? '' : 'User ' + this.state.lastFailed + ' does not exist'}</div>
                <h2>House creation - {this.state.houseName}</h2>
                <h3>
                    Add people to this house
                </h3>
                {memberNames}
                <label>
                    User's email: 
                    <input type="text" onChange={this.handleChange} value={this.state.currentInput} onKeyPress={this.handleKeyPress} ref={(input)=>{this.field = input;}}/>
                <button type="submit" onClick={this.submit}>Submit</button>
                </label>
                <button type="submit" onClick={this.next}>Next</button>
            </div>);
    }
}

export default HC_tasks;