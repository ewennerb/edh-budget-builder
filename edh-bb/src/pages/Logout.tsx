import React from "react"
import firebase from "firebase/app";
import { Redirect } from "react-router";

const Logout: React.FC = () => {

  const redirectToLogin = () => {
    return <Redirect to='login'/>
  }

  firebase.auth().signOut();

  return (
    <div>{redirectToLogin()}</div>
  )
}

export default Logout;
