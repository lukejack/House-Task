import React from 'react';

class SignUp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isAuth: this.props.isAuth,
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    componentDidMount(){
    }

    componentWillUnmount(){
    }  

    render(){
        return (
        <div>
        <h1>Login</h1>
        <ul>
          <a href='/app/signup'>Sign up</a>
          <br/>
          <a href='/app/login'>Log in</a>
          <br/>
          <a href='/app/housecreate'>House creation</a>
          <br/>
        </ul>
      </div>
      );
    }
}

export default SignUp;