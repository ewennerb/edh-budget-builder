import React from 'react';
import TextField from '@material-ui/core/TextField';
import firebase from "firebase/app";
import { withSnackbar, WithSnackbarProps } from "notistack";
import { RouteComponentProps } from "react-router";
import { validateDeckName } from '../common';

//import { Link, LinkProps } from 'react-router-dom';

/*const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));*/

interface deckInfo {
  deckName: string;
  deckDescription: string;
  cards: string;
}

export function isValidTitle(title: string) {
  if (title.length > 100) {
    return false;
  }
  let hasNonSpaceChar: boolean = false;
  for (var char of title) {
    if (char !== ' ') {
      hasNonSpaceChar = true;
      break;
    }
  }
  if (!hasNonSpaceChar) {
    return false;
  }
  return true;
}

type CreateProps = RouteComponentProps & WithSnackbarProps;

class CreateDeck extends React.Component<{ user: firebase.User } & CreateProps> {
  userDocRef: firebase.firestore.DocumentReference;
  constructor(props: Readonly<{ user: firebase.User } & CreateProps>) {
    super(props);
    this.userDocRef = firebase.firestore().collection("users").doc(this.props.user.uid);
    this.state = { value: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidTitle2 = this.isValidTitle2.bind(this);
  }

  public isValidTitle2(title: string = "testString") {
    const errorMsg = validateDeckName(title);
    if (errorMsg != null) {
      this.props.enqueueSnackbar(errorMsg, { variant: 'error' });
      return false;
    }
    return true;
  }

  /*public isValidDescription(description: string) {
    if (description.length === 0) {
      this.props.enqueueSnackbar("Deck description is required", { variant: 'error' });
      return false;
    }
    return true;
  }*/

  handleSubmit(event: any, user = this.userDocRef.get()) {
    event.preventDefault();

    let title: string = event.target.deckName.value;
    if (!this.isValidTitle2(title)) {
      return;
    }
    firebase.firestore().collection('deck').add({
      deckName: event.target.deckName.value,
      deckDescription: event.target.deckDescription.value,
      deck: [],
      ownerID: this.props.user.uid
    }).then(function (deckRef) {
      console.log("Deck written with ID: " + deckRef.id);
    })

    console.log('values input into database: name=' + event.target.deckName.value + ', description=' + event.target.deckDescription.value);
    this.props.history.push("/deck-list")
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="innerForm">
        <h1>Create Deck</h1>
        <TextField
          required
          id="deckName"
          label="Deck Name"
          margin="normal"
        />
        <br></br>
        <TextField
          id="deckDescription"
          placeholder="Deck Description"
          label="Deck Description"
          multiline
          rowsMax="4"
          margin="normal"
        />
        <br></br>
        <br></br>

        <button data-testid="submit">Submit</button>
      </form>
    );
  }
}

export default withSnackbar(CreateDeck);
