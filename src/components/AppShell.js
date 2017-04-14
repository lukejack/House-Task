//Root component of web app

import React from 'react';
import HouseCreate from './HouseCreate';
import TaskCompletion from './TaskCompletion';
import Completions from './Completions';
import Admin from './Admin';
var base64url = require('base64-url');
let tools = require('../clientTools');
var Loader = require('halogen/MoonLoader');
var spinner_css = require('../react-styles.js').spinner;


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
      members: null,
      error: false,
      icon: false,
      b_t: '',
      b_h: '',
      b_c: '',
      b_a: ''
    }

    //Function binding
    this.componentDidMount = this.componentDidMount.bind(this);
    this.houseChange = this.houseChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.pullData = this.pullData.bind(this);
    this.delete = this.delete.bind(this);
    this.addTasks = this.addTasks.bind(this);
    this.getIcon = this.getIcon.bind(this);
    this.getMembers = this.getMembers.bind(this);
    this.addCompletion = this.addCompletion.bind(this);
  }

  componentDidMount() {
    //Get user information into state
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
    tools.get('/json/houses', this, (data, stateRef) => {
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
      if (data.houses.length > 0) {
        //If there are houses, pull data
        stateRef.pullData(data)
      } else {
        //Otherwise go to the house creation
        stateRef.pageChange({ target: { value: 'create' }, preventDefault: () => { } });
      };
    });
  }

  pullData(houseData) {
    //Get tasks, completions, members, and icon for house
    tools.get('/json/completions/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ completions: data }, () => {
        stateRef.pageChange({ target: { value: 'housestats' }, preventDefault: () => { } });
      });
    });

    //Get all the tasks for the selected house
    tools.get('/json/tasks/' + this.state.currentHouse, this, (data, stateRef) => {
      stateRef.setState({ tasks: data });
    });
    this.getIcon(this.state.currentHouse);
    this.getMembers(this.state.currentHouse);
  }

  addTasks(tasks) {
    //Add this new task to our state
    this.setState((prevState, props)=>{
      let newTasks = prevState.tasks;
      tasks.forEach((task)=>{
        newTasks.push(task);
      });
      return {tasks: newTasks};
    });
  }

  getMembers(house) {
    //Get all members of house
    tools.get('/json/members/' + house, this, (data, stateRef) => {
      if (data.members) {
        this.setState({ members: data.members });
      } else {
        if (data.error) { alert(data.error) };
      }
    });
  }

  getIcon(house) {
    //Use icon in session storage, or download new icon
    let sesh = JSON.parse(sessionStorage.getItem(house));
    if (!sesh) { sesh = {} };
    if (sesh && sesh.icon) {
      this.setState({ icon: sesh.icon });
    } else {
      sessionStorage.removeItem(house);
      tools.get('/json/icon/' + house, this, (data, stateRef) => {
        if (data.icon) {
          let icon = base64url.unescape(data.icon);
          while (icon.charAt(icon.length - 1) === '=') {
            icon = icon.slice(0, icon.length - 1);
          };
          stateRef.setState({ icon: icon });
          sesh.icon = icon;
          sessionStorage.setItem(house, JSON.stringify(sesh));
        } else {
          sesh.icon = false;
          this.setState({ icon: false });
          sessionStorage.setItem(house, JSON.stringify(sesh));
        }
      });
    }
  }

  houseChange(event) {
    //Get data for new changed house
    this.pageChange({ target: { value: 'spinner' }, preventDefault: () => { } });
    let eventData = JSON.parse(event.target.value);
    this.setState({ currentHouse: eventData[0], currentHouseId: eventData[1], icon: false });

    tools.get('/json/completions/' + eventData[0], this, (data, stateRef) => {
      stateRef.setState({ completions: data }, () => stateRef.pageChange({ target: { value: 'housestats' }, preventDefault: () => { } }));
    });

    tools.get('/json/tasks/' + eventData[0], this, (data, stateRef) => {
      stateRef.setState({ tasks: data });
    });

    this.getMembers(eventData[0]);
    this.getIcon(eventData[0]);

    //Local storage of selection
    if (typeof (Storage) !== 'undefined') {
      let houseSelection = { userId: this.state.userId, name: eventData[0], id: eventData[1] };
      localStorage.setItem('houseSelection', JSON.stringify(houseSelection));
    }
  }

  delete(id, type) {
    //Used to delete an item server side and client side
    if (type === 'members') {
      //Members removal
      tools.post('/remove_member/' + this.state.currentHouse, this, (response, stateRef) => {
        if (response.success) {
          tools.delete(stateRef, type, id);
        } else {
          alert(response.error);
        }
      }, 'id=' + id);
    } else {
      //Any other removal
      tools.post('/del/' + type, this, (response, stateRef) => {
        if (response.success) {
          tools.delete(stateRef, type, id);
        } else {
          alert(response.error);
        }
      }, 'id=' + id + '&houseId=' + this.state.currentHouseId);
    }
  }

  addCompletion(completion){
    this.setState((prevState, props)=>{
      let newCompletions = prevState.completions;
      newCompletions.push(completion);
      return {completions: newCompletions};
    });
  }

  pageChange(e) {
    //New page is selected from the top

    //Set window resize to nothing so that it does call functions in unmounted components
    window.onresize = (_) => { };
    e.preventDefault();
    this.setState({ page: e.target.value });
    //Set tab selection css
    switch (e.target.value) {
      case 'create':
        this.setState({
          b_t: '', b_c: 'activeTab', b_h: '', b_a: ''
        });
        break;
      case 'complete':
        this.setState({
          b_t: 'activeTab', b_c: '', b_h: '', b_a: ''
        });
        break;
      case 'housestats':
        this.setState({
          b_t: '', b_c: '', b_h: 'activeTab', b_a: ''
        });
        break;
      case 'admin':
        this.setState({
          b_t: '', b_c: '', b_h: '', b_a: 'activeTab'
        });
        break;
      default:
        break;
    }
  }

  render() {
    //Map houses for drop down selection
    let housesList = this.state.houses.map((house) => <option key={house.name} value={JSON.stringify([house.name, house._id])}>{house.name}</option>);
    let hasHouses = (this.state.houses.length != 0);

    //Set main page content
    let content;
    switch (this.state.page) {
      case 'create':
        content = <HouseCreate />;
        break;
      case 'complete':
        content = <TaskCompletion addTasks={this.addTasks} house={this.state.currentHouse} houseId={this.state.currentHouseId} tasks={this.state.tasks} addCompletion={this.addCompletion} pageChange={this.pageChange}/>;
        break;
      case 'housestats':
        content = <Completions id={this.state.userId} tasks={this.state.completions} houseName={this.state.currentHouse} icon={this.state.icon} />;
        break;
      case 'admin':
        content = <Admin refresh={this.componentDidMount} pageChange={this.pageChange} getIcon={this.getIcon} house={this.state.currentHouse} houseId={this.state.currentHouseId} tasks={this.state.tasks} completions={this.state.completions} members={this.state.members} getMembers={this.getMembers} delete={(id, url) => { this.delete(id, url) }} />;
        break;
      default:
        content = <div style={spinner_css}><Loader color={'#000000'} /></div>;
        break;
    }


    return (
      this.state.error ?
        <a href='/login'>Log in to view this page.</a> :
        <div>
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
              {content}
            </div>
            <div className='row'>
              <h6 className='two columns'>
                House:
                </h6>
              <select name='houses' value={JSON.stringify([this.state.currentHouse, this.state.currentHouseId])} className='four columns' onChange={this.houseChange}>
                {housesList}
              </select>
              <div className='three columns'>
                <h6>
                  {this.state.fname} {this.state.lname}
                </h6>
              </div>
              <div className='three columns'>
                <button style={{ width: '100%' }} onClick={
                  () => { document.location.href = "/logout" }
                }>
                  Logout
              </button>
              </div>
            </div>
          </div>

        </div>

    );
  }
}

export default AppShell;