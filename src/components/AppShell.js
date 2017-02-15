import React from 'react';
import { Link } from 'react-router';
import HouseCreate from './HouseCreate';
import TaskCompletion from './TaskCompletion';
let tools = require('../clientTools');

class AppShell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: '...',
      lname: '...',
      houses: [],
      tasks: null,
      page: null,
      error: false
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.houseChange = this.houseChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
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
          currentHouse: (data.houses.length > 0) ? data.houses[0].name : null,
          currentHouseId: (data.houses.length > 0) ? data.houses[0]._id : null
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
    let eventData = JSON.parse(event.target.value);
    this.setState({ currentHouse: eventData[0], currentHouseId: eventData[1] });
    tools.get('/json/tasks/' + eventData[0], this, (data, stateRef) => {
      stateRef.setState({ tasks: data });
    });
  }

  pageChange(e) {
    e.preventDefault();
    this.setState({ page: e.target.value });
  }

  render() {
    let housesList = this.state.houses.map((house) => <option key={house.name} value={JSON.stringify([house.name, house._id])}>{house.name}</option>);
    let hasHouses = (this.state.houses.length != 0);

    let content;
    switch (this.state.page) {
      case 'create':
        content = <HouseCreate />;
        break;
      case 'complete':
        content = <TaskCompletion house={this.state.currentHouse} houseId={this.state.currentHouseId} tasks={this.state.tasks} />;
        break;
      default:
        content = (<p>No selection</p>);
        break;
    }



    return (
      this.state.error ?
        <a href='/login'>Log in to view this page</a> :
        <div className='container'>
          <div className='row'>
            <button className='four columns' onClick={this.pageChange} value={'complete'}>
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
            {content}
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
              <button onClick={this.pageChange} value={'create'}>
                Create
              </button>
            </div>
          </div>
        </div>
    );
  }
}

export default AppShell;