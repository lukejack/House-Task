import React from 'react';
let tools = require('../clientTools');

class AppShell extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          fname: 'waiting',
          lname: 'waiting',
          email: 'waiting',
          error: false
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    componentDidMount(){
      /*
      this.setState((prevState, props) => {return {
        fname: 'Yadad'
           }}); */

      tools.get('/json/user', this, function (data, stateRef){
          stateRef.setState((prevState, props) => {return {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            error: data.error
          }});
        });
    }

    componentWillUnmount(){
    }  

    render(){
      let topBarStyle = {
        width: '100%',
        backgroundColor: "#ffde00",
        color: "#333",
        fontFamily: "monospace",
        fontSize: "32",
        textAlign: "center"
      };

        return (
          this.state.error ? 
            <a href='/login'>Log in to view this page</a> :
          <div>
            <div style={topBarStyle}>
              {'Logged in as ' + this.state.fname + ' ' + this.state.lname}
            </div>
            <a>{this.props.children}</a>
          </div>
        );
    }
}

export default AppShell;