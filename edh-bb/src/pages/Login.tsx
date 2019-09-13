import React from "react"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from "firebase/app";

const Login: React.FC = () => {
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/change-username',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  };
  return (
    <div>
      <h1>[Login]</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  )
}

export default Login;
