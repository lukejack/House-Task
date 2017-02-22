import React from 'react';
import { Link } from 'react-router';
import HouseCreate from './HouseCreate';
import TaskCompletion from './TaskCompletion';
import Completions from './Completions';
import Admin from './Admin';
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
      completions: null,
      error: false
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.houseChange = this.houseChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.pullData = this.pullData.bind(this);
  }

  componentDidMount() {

    if (typeof (Storage) !== "undefined") {
      let houseSelectionJSON = localStorage.getItem('houseSelection');
      if (houseSelectionJSON) {
        let houseSelection = JSON.parse(houseSelectionJSON);
        this.setState({
          currentHouse: houseSelection.name,
          currentHouseId: houseSelection.id
        });
      }
    }

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
        if (prevState.currentHouse && prevState.currentHouseId)
          return {
            houses: data.houses,
            page: (data.houses.length > 0) ? 'housestats' : 'create',
          }
        else
          return {
            houses: data.houses,
            page: (data.houses.length > 0) ? 'housestats' : 'create',
            currentHouse: (data.houses.length > 0) ? data.houses[0].name : null,
            currentHouseId: (data.houses.length > 0) ? data.houses[0]._id : null
          }
      });
      stateRef.pullData();
    });

  }

  pullData() {
    //Get all the tasks for the selected house
    tools.get('/json/tasks/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ tasks: data });
    });

    tools.get('/json/completions/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ completions: data });
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

    tools.get('/json/completions/' + eventData[0], this, (data, stateRef) => {
      stateRef.setState({ completions: data });
    });

    //Local storage of selection
    if (typeof (Storage) !== 'undefined') {
      let houseSelection = { name: eventData[0], id: eventData[1] };
      localStorage.setItem('houseSelection', JSON.stringify(houseSelection));
    }
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
        content = <TaskCompletion refresh={this.componentDidMount} house={this.state.currentHouse} houseId={this.state.currentHouseId} tasks={this.state.tasks} />;
        break;
      case 'housestats':
        content = <Completions tasks={this.state.completions} houseName={this.state.currentHouse} />;
        break;
      case 'admin':
        content = <Admin refresh={this.componentDidMount} house={this.state.currentHouse} houseId={this.state.currentHouseId} tasks={this.state.tasks} />;
        break;
      default:
        content = (<p>Waiting for content...</p>);
        break;
    }



    return (
      this.state.error ?
        <a href='/login'>Log in to view this page.</a> :
        <div className='container'>
          <div className='row'>
            <button className='three columns' onClick={this.pageChange} value={'complete'}>
              Task+
            </button>

            <button className='three columns' onClick={this.pageChange} value={'housestats'}>
              House Stats
                </button>
            <button className='three columns' onClick={this.pageChange} value={'create'}>
              Create
                </button>
            <button className='three columns' onClick={this.pageChange} value={'admin'}>
              Admin
                </button>
          </div>
          <div className='innerComponent'>
            {content}
          </div>
          <div className='row'>
            <h5 className='two columns'>
              House:
                </h5>
            <select name='houses' value={JSON.stringify([this.state.currentHouse, this.state.currentHouseId])} className='four columns' onChange={this.houseChange}>
              {housesList}
            </select>
            <div className='three columns'>
              <h5>
                {this.state.fname} {this.state.lname}
              </h5>
            </div>
            <div className='three columns'>
              <button onClick={
                () => { document.location.href = "/logout" }
              }>
                Logout
              </button>
            </div>
          </div>
        </div>
    );
  }
}

export default AppShell;