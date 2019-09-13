import React from 'react';
import { BrowserRouter as Router, Route, Redirect, RouteComponentProps, RouteProps } from "react-router-dom";
import Login from './pages/Login';
import DeckList from './pages/DeckList';
import CreateDeck from './pages/CreateDeck';
import DeckDetail from './pages/DeckDetail';
import CardSearch from './pages/CardSearch';
import ChangeUsername from './pages/ChangeUsername';

const App: React.FC = () => {
  return (
    <Router>
      <Header />

      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/" component={DeckList} />
      <PrivateRoute exact path="/create-deck" component={CreateDeck} />
      <PrivateRoute path="/deck/" component={DeckDetail} />
      <PrivateRoute exact path="/search" component={CardSearch} />
      <PrivateRoute exact path="/change-username" component={ChangeUsername} />
    </Router>
  );
}

const Header: React.FC = () => {
  // TODO
  return (
    <h1>[Header]</h1>

    //TODO add logout button here. Test 44: User is logged out and returns to login page
  );
}

type PrivateRouteProps = RouteProps & {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>
}
const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = true; // TODO: authentication
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

export default App;
