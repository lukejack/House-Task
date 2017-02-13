import React from 'react';
import ReactDOM from 'react-dom';
let tools = require('./clientTools');
import AppShell from './components/AppShell';
import HouseCreate from './components/HouseCreate';
import HouseView from './components/HouseCreate';
import TaskCompletion from './components/TaskCompletion';

import { Router, Route, hashHistory, Link } from 'react-router';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={AppShell} >
      <Route path="create" component={HouseCreate}/>
      <Route path="houses" component={HouseView}/>
      <Route path="add/:tasks" component={TaskCompletion}/>
    </Route>
  </Router>),
  document.getElementById('root')
);