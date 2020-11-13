import React, { Component } from 'react';
import './app.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './containers/Home';
import OneToOne from './containers/OneToOne';
import GroupChat from './containers/GroupChat';
import Room from './containers/Room';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route
              path='/'
              exact={true}
              render={(props) => <Home {...props} />}
            />
            <Route
              path='/onetoone'
              exact={true}
              render={(props) => <OneToOne {...props} />}
            />
            <Route
              path='/groupchat'
              exact={true}
              render={(props) => <GroupChat {...props} />}
            />
            <Route
              path='/room/:roomID'
              exact={true}
              render={(props) => <Room {...props} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
