import React from "react"
import firebase from "firebase/app";
import { Route, BrowserRouter } from "react-router-dom";
import Login from './Login';


const Logout: React.FC = () => {

  const redirectToLogin = () => {
    return (
      <BrowserRouter>
        <div>
          <Route path="/login" component={Login} />
        </div>
      </BrowserRouter>
    )
  }

  firebase.auth().signOut();

  return (
    <div>{redirectToLogin()}</div>
  )
}

export default Logout;
