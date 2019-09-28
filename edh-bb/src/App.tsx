import React, { useState } from 'react';
import { Route, Redirect, Switch, Link } from "react-router-dom";
import Login from './pages/Login';
import DeckList from './pages/DeckList';
import CreateDeck from './pages/CreateDeck';
import DeckDetail from './pages/DeckDetail';
import CardSearch from './pages/CardSearch';
import ChangeUsername from './pages/ChangeUsername';
import Logout from './pages/Logout';
import firebase from "firebase/app";
import { AuthContext } from "./common";
import { AppBar, Toolbar, Typography, Tabs, Tab, Button } from '@material-ui/core';
import { TabProps } from '@material-ui/core/Tab';
import { LinkProps } from '@material-ui/core/Link';
import Async, { IfFulfilled } from 'react-async';

const App: React.FC<{ user: firebase.User | null }> = (({ user: initialUser }) => {
  const [user, setUser] = useState(initialUser);
  if (!user) {
    return (
      <Switch>
        {/*
        onAuthStateChanged gets called after the redirect in Login happens,
        so then the "not logged in" redirect happens before the user state here changes.
        To work around this, we pass a callback to Login to be called before it redirects.
        */}
        <Route exact path="/login" render={() => <Login onUserChanged={setUser} />} />
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
          <Header user={user} />
          <Switch>
            <Route exact path="/deck-list" render={() => <DeckList user={user} />} />
            <Route exact path="/create-deck" render={() => <CreateDeck user={user} />} />
            <Route path="/deck-detail/" component={DeckDetail} />
            <Route exact path="/search" render={() => <CardSearch user={user} />} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/change-username" render={() => <ChangeUsername user={user} />} />
            <Redirect from="/login" to="/" />
          </Switch>
        </AuthContext.Provider>
      </div>
    );
  }
})

const pathToTab = (pathname: string) => {
  const i = pathname.indexOf('/', 1)
  const firstSegment = pathname.substring(0, i === -1 ? undefined : i);
  // the DeckDetail pages should be under the deck list tab
  return firstSegment === "/deck-detail" ? "/deck-list" : firstSegment;
};

type LinkTabProps = {
  label: string;
  value: string;
} & Omit<TabProps<typeof Link, LinkProps>, 'component' | 'id' | 'to'>;

const LinkTab: React.FC<LinkTabProps> = props => (
  <Tab component={Link} id={"nav-tab-" + props.label.replace(' ', '-')} to={props.value} {...props} />
)

class Header extends React.Component<{ user: firebase.User }> {
  loadPromise: () => Promise<string>;

  constructor(props: Readonly<{ user: firebase.User }>) {
    super(props);
    const userDocRef = firebase.firestore().collection("users").doc(this.props.user.uid);
    this.loadPromise = async () => {
      const doc = await userDocRef.get();
      return doc.get("username")
    }
  }

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            EDH Budget Builder
          </Typography>
          <Async promiseFn={this.loadPromise}>
            {state =>
              <IfFulfilled state={state}>
                {username =>
                  <Typography variant="subtitle1">
                    Hello, {username}
                  </Typography>
                }
              </IfFulfilled>
            }
          </Async>
          <Button color="inherit" href="/logout">
            Log out
          </Button>
        </Toolbar>
        <Route render={({ location }) => (
          <Tabs value={pathToTab(location.pathname)}>
            <LinkTab label="deck list" value="/deck-list" />
            <LinkTab label="create deck" value="/create-deck" />
            <LinkTab label="search cards" value="/search" />
            <LinkTab label="change username" value="/change-username" />
          </Tabs>
        )} />
      </AppBar>
    );
  }
}

export default App;
