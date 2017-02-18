import React from 'react';
import ObjectTable from './ObjectTable';
let tools = require('../clientTools');

let id = 0;

function genId(){
    return id++;
}

class HC_members extends React.Component{
    constructor(props){
        super(props);

        this.state = {
        };

    }

    componentDidMount(){
        
    }

    render(){
        
        let errorMessage;

        if (this.state.error) {
            errorMessage = this.state.error;
        } else
            errorMessage = '';
        
        return(
            <div>
                
                <h2>Task completions - {this.props.houseName}</h2>
                <h3>
                    Completions by all house members
                </h3>
                <ObjectTable items={this.props.tasks} headings={['fname', 'lname', 'name', 'difficulty', 'description', 'date']} delete={(id)=>{}}/>
                <label>
                <div>{errorMessage}</div>
                </label>
            </div>);
    }
}

export default HC_members;