import React from "react"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from "firebase/app";

const Login: React.FC<{ testAuthUiCallback_?: () => void }> = ({ testAuthUiCallback_ }) => {
  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl = '/') => {
        if (authResult.additionalUserInfo.isNewUser) {
          redirectUrl = '/change-username';
        }
        window.location.assign(redirectUrl);
        return false;
      }
    },
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ]
  };
  return (
    <div>
      <h1>[Login]</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} uiCallback={testAuthUiCallback_} />
    </div>
  )
}

export default Login;
