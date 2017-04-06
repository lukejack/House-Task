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
      error: false,
      icon: false,
      b_t: '',
      b_h: '',
      b_c: '',
      b_a: ''
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.houseChange = this.houseChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.pullData = this.pullData.bind(this);
    this.delete = this.delete.bind(this);
    this.addTasks = this.addTasks.bind(this);
  }

  componentDidMount() {

    //Get user information
    tools.get('/json/user', this, function (data, stateRef) {
      if (typeof (Storage) !== "undefined") {
        let houseSelectionJSON = localStorage.getItem('houseSelection');
        if (houseSelectionJSON) {
          let houseSelection = JSON.parse(houseSelectionJSON);
          if (houseSelection.userId === data.id)
            stateRef.setState({
              currentHouse: houseSelection.name,
              currentHouseId: houseSelection.id
            });
        }
      }

      stateRef.setState((prevState, props) => {
        return {
          fname: data.fname,
          lname: data.lname,
          userId: data.id
        }
      });
    });

    //Get all of the houses the user is a member of
    tools.get('/json/houses', this, function (data, stateRef) {
      stateRef.setState((prevState, props) => {
        if (prevState.currentHouse && prevState.currentHouseId)
          return { houses: data.houses }
        else
          return {
            houses: data.houses,
            currentHouse: (data.houses.length > 0) ? data.houses[0].name : null,
            currentHouseId: (data.houses.length > 0) ? data.houses[0]._id : null
          }
      });
      stateRef.pullData(data);
    });
  }

  pullData(houseData) {
    //Get all the tasks for the selected house
    tools.get('/json/tasks/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ tasks: data });
    });
    tools.get('/json/completions/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ completions: data }, () => {
        //Now we have all the data, we can decide whether to show the stats or house creation interface (wrapping for event function)
        stateRef.pageChange({ target: { value: (houseData.houses.length > 0) ? 'housestats' : 'create' }, preventDefault: () => { } });
      });
    });
    tools.get('/json/icon/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ icon: data.icon });
    });

  }

  componentWillUnmount() {

  }

  addTasks(){
    //Get the new task's ID from the server and add that task to the list
    tools.get('/json/tasks/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ tasks: data }, ()=>stateRef.pageChange({ target: { value: 'complete' }, preventDefault: () => { } }));
    });
  }

  houseChange(event) {
    let eventData = JSON.parse(event.target.value);
    this.setState({ currentHouse: eventData[0], currentHouseId: eventData[1] });

    tools.get('/json/tasks/' + eventData[0], this, (data, stateRef) => {
      stateRef.setState({ tasks: data });
    });

    tools.get('/json/completions/' + eventData[0], this, (data, stateRef) => {
      stateRef.setState({ completions: data }, ()=>stateRef.pageChange({ target: { value: 'housestats' }, preventDefault: () => { } }));
    });

    //Local storage of selection
    if (typeof (Storage) !== 'undefined') {
      let houseSelection = { userId: this.state.userId, name: eventData[0], id: eventData[1] };
      localStorage.setItem('houseSelection', JSON.stringify(houseSelection));
    }
  }

  delete(id, type) {
    tools.post('/del/' + type, this, (response, stateRef) => {
      if (response.success) {
        tools.delete(stateRef, type, id);
      } else {
        alert(response.error);
      }
    }, 'id=' + id + '&houseId=' + this.state.currentHouseId);
  }

  pageChange(e) {
    e.preventDefault();
    this.setState({ page: e.target.value });
    switch (e.target.value) {
      case 'create':
        this.setState({
          content: <HouseCreate />,
          b_t: '', b_c: 'activeTab', b_h: '', b_a: ''
        });
        break;
      case 'complete':
        this.setState({
          content: <TaskCompletion addTasks={this.addTasks} house={this.state.currentHouse} houseId={this.state.currentHouseId} tasks={this.state.tasks} />,
          b_t: 'activeTab', b_c: '', b_h: '', b_a: ''
        });
        break;
      case 'housestats':
        this.setState({
          content: <Completions tasks={this.state.completions} houseName={this.state.currentHouse} />,
          b_t: '', b_c: '', b_h: 'activeTab', b_a: ''
        });
        break;
      case 'admin':
        this.setState({
          content: <Admin refresh={this.componentDidMount} house={this.state.currentHouse} houseId={this.state.currentHouseId} tasks={this.state.tasks} completions={this.state.completions} delete={(id, url) => { this.delete(id, url) }} />,
          b_t: '', b_c: '', b_h: '', b_a: 'activeTab'
        });
        break;
      default:
        this.setState({ content: (<p>Waiting for content...</p>) });
        break;
    }
  }

  render() {
    let housesList = this.state.houses.map((house) => <option key={house.name} value={JSON.stringify([house.name, house._id])}>{house.name}</option>);
    let hasHouses = (this.state.houses.length != 0);

    let icon = <div></div>;
    /*
        if (this.state.icon) {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext("2d");
          let image = new Image();
          
          image.onload = function () {
            ctx.drawImage(image, 0, 0);
          };
          image.src = this.state.icon;
          icon = canvas;
        }*/
    //console.log('icon base: ', this.state.icon);
    return (
      this.state.error ?
        <a href='/login'>Log in to view this page.</a> :
        <div className='container'>
          <div className='row'>
            <button className={'three columns ' + this.state.b_t} onClick={hasHouses ? this.pageChange : () => { }} value={'complete'}>
              Tasks
            </button>

            <button className={'three columns ' + this.state.b_h} onClick={hasHouses ? this.pageChange : () => { }} value={'housestats'}>
              Completions
                </button>
            <button className={'three columns ' + this.state.b_a} onClick={hasHouses ? this.pageChange : () => { }} value={'admin'}>
              Admin
                </button>
            <button className={'three columns ' + this.state.b_c} onClick={this.pageChange} value={'create'}>
              New House
                </button>
          </div>
          <div className='innerComponent'>
            {this.state.content}
          </div>
          <div className='row'>
            <h5 className='two columns'>
              House:
                </h5>
            <select name='houses' value={JSON.stringify([this.state.currentHouse, this.state.currentHouseId])} className='four columns' onChange={this.houseChange}>
              {housesList}
            </select>
            <div className='three columns'>
              <h6>
                {this.state.fname} {this.state.lname}
              </h6>
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