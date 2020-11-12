import React, { Component } from 'react';
import './app.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './containers/Home';
import Room from './containers/Room';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null
    }
  }

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        {username ? <h1>{`Hola ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        <BrowserRouter>
          <Switch>
            <Route
              path='/'
              exact={true}
              render={(props) => <Home {...props} />}
            />
            <Route
              path='/room'
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
