import React from 'react';
import ReactDOM from 'react-dom';
let tools = require('./clientTools');
import AppShell from './components/AppShell';
import { Router, Route, hashHistory, Link } from 'react-router';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={AppShell}>
    </Route>
  </Router>),
  document.getElementById('root')
);