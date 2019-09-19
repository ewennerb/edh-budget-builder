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
import { AppBar, Toolbar, Typography, Tabs, Tab, Button } from '@material-ui/core';
import { TabProps } from '@material-ui/core/Tab';

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

const pathToTab = (pathname: string) => {
  const i = pathname.indexOf('/', 1)
  const firstSegment = pathname.substring(0, i === -1 ? undefined : i);
  // the DeckDetail pages should be under the deck list tab
  return firstSegment === "/deck" ? "/" : firstSegment;
};

type LinkTabProps = {
  label: string;
  value: string;
} & TabProps<"a">;

const LinkTab: React.FC<LinkTabProps> = props => (
  <Tab component="a" id={"nav-tab-" + props.label.replace(' ', '-')} href={props.value} {...props} />
)

class Header extends React.Component {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  render() {
    // TODO
    const currentUser = this.context;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            EDH Budget Builder
          </Typography>
          <Typography variant="subtitle1">
            Hello, {currentUser.displayName}
          </Typography>
          <Button color="inherit" href="/logout">
            Log out
          </Button>
        </Toolbar>
        <Route render={({ location }) => (
          <Tabs value={pathToTab(location.pathname)}>
            <LinkTab label="deck list" value="/" />
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
