import React from 'react';
let tools = require('../clientTools');

class AppShell extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          fname: '...',
          lname: '...',
          email: '...',
          houses: [],
          hasHouses: true,
          error: false
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }

    componentDidMount(){

      tools.get('/json/user', this, function (data, stateRef){
          stateRef.setState((prevState, props) => {return {
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            error: data.error
          }});
        });

        tools.get('/json/houses', this, function (data, stateRef){
          if (!data.houses)
          {
            stateRef.setState({hasHouses: false});
          }
          stateRef.setState((prevState, props) => {return {
            houses: data.houses
          }});

        });

    }

    componentWillUnmount(){
    }  

    render(){
        let housesList = this.state.houses.map((house)=><option>{house}</option>);
        return (
          this.state.error ? 
            <a href='/login'>Log in to view this page</a> :
            <div className='container'>
              <div className='row'>
                <button className='four columns'>
                  Task+
                </button>
                <button className='four columns'>
                  My Stats
                </button>
                <button className='four columns'>
                  House Stats
                </button>
              </div>
              
              {/*FIX THIS AS IT WORKS AND I DONT KNOW WHY*/}
              <div>{this.state.hasHouses ? this.props.children : <link to={'/create'}>You arent a member of any houses, click here to create one</link>}</div>
              <div className='row'>
                <h5 className='two columns'>
                  House:
                </h5>
                <select name='houses' className='four columns'>
                  {housesList}
                </select>
                <div className='three columns'>
                  <h5>
                    {this.state.fname} {this.state.lname}
                  </h5>
                </div>
                <div className='three columns'>
                  <button>
                    Logout
                  </button>
                </div>
              </div>
            </div>
        );
    }
}

export default AppShell;