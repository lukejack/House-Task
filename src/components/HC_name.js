import React from 'react';

class HC_name extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inputText: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleChange(event){
        this.setState({inputText : event.target.value});
    }

    submit(){
        this.props.setHouseName(this.state.inputText);
        this.props.incrementStep();
    }

    render(){
        return(
            
            <div>
                <h2>House creation</h2>
                <h4>Give a name to your house: <input type="text" onChange={this.handleChange}/></h4>
                <button type="submit" onClick={this.submit}>Next</button>
            </div>);
    }
}

export default HC_name;