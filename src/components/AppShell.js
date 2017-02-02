import React from 'react';
import {Link} from 'react-router';
import HouseCreate from './HouseCreate';
let tools = require('../clientTools');

class AppShell extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          fname: '...',
          lname: '...',
          email: '...',
          houses: [],
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
            email: data.email
          }});
        });

        tools.get('/json/houses', this, function (data, stateRef){
            stateRef.setState((prevState, props) => {return {
              houses: data.houses
            }});
        });

    }

    componentWillUnmount(){
    }  

    render(){
        let housesList = this.state.houses.map((house)=><option>{house}</option>);
        let hasHouses = (this.state.houses.length != 0);

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
              <div className='innerComponent'>
              {hasHouses ? this.props.children : <HouseCreate/>}
              </div>
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