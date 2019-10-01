import React from "react"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from "firebase/app";
import { withRouter, RouteComponentProps } from "react-router";

type LoginProps = {
  onUiRendered?: () => void, /// used by tests only
  onUserChanged: (user: firebase.User) => void,
};

const Login: React.FC<LoginProps & RouteComponentProps> = ({ onUserChanged, onUiRendered, history }) => {
  const uiConfig: firebaseui.auth.Config = {
    signInFlow: 'popup',
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl = '/deck-list') => {
        if (authResult.additionalUserInfo.isNewUser) {
          redirectUrl = '/change-username';
        }
        onUserChanged(authResult.user);
        history.push(redirectUrl);
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
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} uiCallback={onUiRendered} />
    </div>
  )
}

export default withRouter(Login);
