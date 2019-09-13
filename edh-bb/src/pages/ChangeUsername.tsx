import React from "react"
import Async, { IfFulfilled, IfPending } from "react-async"
import firebase from "firebase/app";
import "firebase/firestore";
import { TextField, Button } from '@material-ui/core';

class ChangeUsername extends React.Component<{ user: firebase.User }> {
  userDocRef: firebase.firestore.DocumentReference;
  loadPromise: () => Promise<string>;

  constructor(props: Readonly<{ user: firebase.User }>) {
    super(props);
    this.userDocRef = firebase.firestore().collection("users").doc(this.props.user.uid);
    this.loadPromise = async () => {
      try {
        const doc = await this.userDocRef.get();
        const data = doc.data();
        return data ? data.username : "";
      } catch (err) {
        // TODO: snackbar
        console.error("Error getting username: ", err);
      }
    };
  }

  static validateUsername = (newUsername: string) => (
    newUsername.length === 0
      ? "Username must not be empty"
      : !/^[a-zA-Z0-9]+$/.test(newUsername)
        ? "Username must only contain letters, numbers, hyphens, and underscores"
        : null
  )

  handleSubmit = (newUsername: string) => () => {
    if (ChangeUsername.validateUsername(newUsername) === null) {
      this.userDocRef.set({ username: newUsername }).then(() => {
        // TODO: snackbar
      }).catch(err => {
        // TODO: snackbar
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

export default ChangeUsername;
