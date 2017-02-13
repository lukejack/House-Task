import React from 'react';
import { Link } from 'react-router';
import HouseCreate from './HouseCreate';
let tools = require('../clientTools');

class AppShell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '...',
      lname: '...',
      houses: [],
      error: false
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.houseChange = this.houseChange.bind(this);
  }

  componentDidMount() {

    //Get user information
    tools.get('/json/user', this, function (data, stateRef) {
      stateRef.setState((prevState, props) => {
        return {
          fname: data.fname,
          lname: data.lname
        }
      });
    });

    //Get all of the houses the user is a member of
    tools.get('/json/houses', this, function (data, stateRef) {
      stateRef.setState((prevState, props) => {
        return {
          houses: data.houses,
          currentHouse: (data.houses.length > 0) ? data.houses[0] : null
        }
      });

      //Get all the tasks for the selected house
      tools.get('/json/tasks/' + stateRef.state.currentHouse, stateRef, (data, stateRef) => {
        stateRef.setState({ tasks: data });
      });

    });

  }

  componentWillUnmount() {
  }

  houseChange(event) {
    this.setState({ currentHouse: event.target.value });
  }

  render() {
    let housesList = this.state.houses.map((house) => <option key={house}>{house}</option>);
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
            {hasHouses ? this.props.children : <HouseCreate />}
          </div>
          <div className='row'>
            <h5 className='two columns'>
              House:
                </h5>
            <select name='houses' className='four columns' onChange={this.houseChange}>
              {housesList}
            </select>
            <div className='three columns'>
              <h5>
                {this.state.fname} {this.state.lname}
              </h5>
            </div>
            <div className='three columns'>
              <Link to='/create'>
                Create
                  </Link>
            </div>
          </div>
        </div>
    );
  }
}

export default AppShell;