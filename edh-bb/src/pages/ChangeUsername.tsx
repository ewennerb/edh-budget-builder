import React from "react"
import Async, { IfFulfilled, IfPending } from "react-async"
import firebase from "firebase/app";
import "firebase/firestore";
import { TextField, Button } from '@material-ui/core';
import { withSnackbar, WithSnackbarProps } from "notistack";

class ChangeUsername extends React.Component<{ user: firebase.User } & WithSnackbarProps> {
  userDocRef: firebase.firestore.DocumentReference;
  loadPromise: () => Promise<string>;

  constructor(props: Readonly<{ user: firebase.User } & WithSnackbarProps>) {
    super(props);
    this.userDocRef = firebase.firestore().collection("users").doc(this.props.user.uid);
    this.loadPromise = async () => {
      try {
        const doc = await this.userDocRef.get();
        const data = doc.data();
        return data ? data.username : "";
      } catch (err) {
        this.props.enqueueSnackbar('Could not get username', { variant: 'error' });
        console.error("Error getting username: ", err);
      }
    };
  }

  static validateUsername = (newUsername: string) => {
    if (newUsername.length === 0)
      return "Username must not be empty";
    if (newUsername.length > 100)
      return "Username must be 100 characters or fewer";
    if (!/^[a-zA-Z0-9-_]+$/.test(newUsername))
      return "Username must only contain letters, numbers, hyphens, and underscores";
    return null;
  }

  handleSubmit = (newUsername: string) => () => {
    if (ChangeUsername.validateUsername(newUsername) === null) {
      this.userDocRef.set({ username: newUsername }).then(() => {
        this.props.enqueueSnackbar('Changed username');
      }).catch(err => {
        this.props.enqueueSnackbar('Could not change username', { variant: 'error' });
        console.log("Error setting username: ", err);
      });
    }
  }

  render() {
    return (
      <Async promiseFn={this.loadPromise}>
        {state =>
          <>
            <IfPending state={state} >
              <h1>Loading...</h1>
            </IfPending>
            <IfFulfilled state={state}>
              {username => {
                const username_error = ChangeUsername.validateUsername(username);
                return (
                  <>
                    <h1>Change Username</h1>
                    <div>
                      <TextField
                        variant="filled"
                        id="username"
                        label="Username"
                        value={username}
                        error={username_error != null}
                        helperText={username_error}
                        onChange={ev => state.setData(ev.target.value)} />
                      <Button variant="contained" onClick={this.handleSubmit(username)}>Submit</Button>
                    </div>
                  </>
                )
              }}
            </IfFulfilled>
          </>
        }
      </Async>
    )
  }
}

export default withSnackbar(ChangeUsername);
