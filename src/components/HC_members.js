import React from 'react';
let tools = require('../clientTools');

class HC_members extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            houseName: this.props.houseName,
            currentInput: '',
            membersToAdd: [],
            userExists: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.next = this.next.bind(this);
    }

    handleChange(event){
        this.setState({userExists: true});
        event.persist();
        this.setState((prevState, props)=>{return {currentInput: event.target.value}});
    }

    submit(){
        tools.get('/json/getuser/' + this.state.currentInput, this, function(data, stateRef){
            if (data.error)
                console.log(data.error);
            else if (data.exists == false)
            {
                stateRef.setState((prevState, props)=>{return {userExists: false}});
            }
            else
                {
                    stateRef.setState((prevState, props)=>{
                        let currentMembers = prevState.membersToAdd;
                        currentMembers.push({email: prevState.currentInput, fname: data.fname, lname: data.lname});
                        console.log(currentMembers);
                        return {
                            membersToAdd: currentMembers
                    }});
                }
        });
    }

    next(){
        this.props.incrementStep();
        this.props.setMembers(this.state.membersToAdd);
    }

    render(){
        let memberNames = this.state.membersToAdd.map((member)=><h4>{member.fname + ' ' + member.lname}</h4>);
        return(
            <div>
                <div>{this.state.userExists ? '' : 'User ' + this.state.currentInput + ' does not exist'}</div>
                <h2>House creation - {this.state.houseName}</h2>
                {memberNames}
                <label>
                    User's email: 
                    <input type="text" onChange={this.handleChange}/>
                <button type="submit" onClick={this.submit}>Submit</button>
                </label>
                <button type="submit" onClick={this.next}>Next</button>
            </div>);
    }
}

export default HC_members;