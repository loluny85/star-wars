import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './components/Login';
import Search from './components/Search';
import Error from './components/Error';
import './styles/App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/login' component={Login} />
          <Route path='/search' component={Search} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
