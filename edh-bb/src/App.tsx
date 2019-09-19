import React from 'react';
import { Route, Redirect, Switch } from "react-router-dom";
import Login from './pages/Login';
import DeckList from './pages/DeckList';
import CreateDeck from './pages/CreateDeck';
import DeckDetail from './pages/DeckDetail';
import CardSearch from './pages/CardSearch';
import ChangeUsername from './pages/ChangeUsername';
import Logout from './pages/Logout';
import firebase from "firebase/app";
import { AuthContext } from "./common";
import NavBar from "./pages/store/components/navigationBar"
import Button from '@material-ui/core/Button';

const App: React.FC<{ user: firebase.User | null }> = (({ user }) => {
  if (!user) {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route render={props =>
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        } />
      </Switch>
    )
  } else {
    return (

      <div>
          <AuthContext.Provider value={user}>
          <Header />
          <NavBar />
          <Switch>
            <Route exact path="/" component={DeckList} />
            <Route exact path="/create-deck" component={CreateDeck} />
            <Route path="/deck/" component={DeckDetail} />
            <Route exact path="/search" component={CardSearch} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/change-username" render={() => <ChangeUsername user={user} />} />
            <Redirect from="/login" to="/" />
          </Switch>
        </AuthContext.Provider>
      </div>
      

    );
  }
})

class Header extends React.Component {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  render() {
    // TODO
    const currentUser = this.context;
    return (
      <div>
        <h1>[Header]</h1>
        userd: {currentUser.uid}
        <h4>Hello, {currentUser.displayName}</h4>

        <div id="logout">
          <Button variant="contained" color="secondary" href="/logout">
            Log out
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
