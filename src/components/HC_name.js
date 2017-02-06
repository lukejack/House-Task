import React from 'react';
let tools = require('../clientTools');

class HC_name extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inputText: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event){
        this.setState({inputText : event.target.value});
    }

    handleKeyPress(target) {
        if(target.charCode==13){
            this.submit();
        }
    }
    
    componentDidMount(){
        this.field.focus();
    }

    submit(){
        /* Check whether the house name is taken 
        Load input into a temporary variable so the user cannot change it mid-request*/
        const input = this.state.inputText;
        if (input === '')
            this.setState({error: 'Enter a name into the box'});
        else{
        tools.get('/json/gethouse/' + input, this, (data, stateRef)=>{
            if (data.error)
                stateRef.setState((prevState, props)=>{return {
                    error: data.error
                }});
            else if (data.exists === true)
                stateRef.setState((prevState, props)=>{return {
                    error: 'That house name has already been taken'
                }});
            else if (data.exists === false)
            {
                this.props.setHouseName(input);
                this.props.incrementStep();
            } else {
                stateRef.setState((prevState, props)=>{ return {
                    error: 'There has been a problem downloading data from the server'
                }});
            }
        });}
        
    }

    render(){
        let errorMessage = this.state.error ? this.state.error : '';

        return(
            
            <div>
                <h2>House creation</h2>
                <h4>Give a name to your house: <input type="text" onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref={(input)=>{this.field = input;}}/></h4>
                <div>{errorMessage}</div>
                <button type="submit" onClick={this.submit}>Next</button>
            </div>);
    }
}

export default HC_name;