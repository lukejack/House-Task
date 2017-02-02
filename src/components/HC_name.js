import React from 'react';

class HC_name extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inputText: ''
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
        this.props.setHouseName(this.state.inputText);
        this.props.incrementStep();
    }

    render(){
        return(
            
            <div>
                <h2>House creation</h2>
                <h4>Give a name to your house: <input type="text" onChange={this.handleChange} onKeyPress={this.handleKeyPress} ref={(input)=>{this.field = input;}}/></h4>
                <button type="submit" onClick={this.submit}>Next</button>
            </div>);
    }
}

export default HC_name;