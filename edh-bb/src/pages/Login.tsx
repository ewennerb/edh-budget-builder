import React from "react"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from "firebase/app";

/// used by tests only
type LoginProps = {
  authUiCallback?: () => void,
  doRedirect?: (url: string) => void,
};

const Login: React.FC<LoginProps> = ({ authUiCallback: testAuthUiCallback_, doRedirect = window.location.assign }) => {
  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl = '/') => {
        if (authResult.additionalUserInfo.isNewUser) {
          redirectUrl = '/change-username';
        }
        doRedirect(redirectUrl);
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
