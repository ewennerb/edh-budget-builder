import React from 'react';
import TextField from '@material-ui/core/TextField';
import firebase from "firebase/app";
import { withSnackbar, WithSnackbarProps } from "notistack";
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

class CreateDeck extends React.Component<{ user: firebase.User } & WithSnackbarProps> {
  userDocRef: firebase.firestore.DocumentReference;
  constructor(props: Readonly<{ user: firebase.User } & WithSnackbarProps>) {
    super(props);
    this.userDocRef = firebase.firestore().collection("users").doc(this.props.user.uid);
    this.state = { value: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isValidTitle(title: string) {
    if (title.length > 100) {
      this.props.enqueueSnackbar('Deck name is too long', { variant: 'error' });
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
      this.props.enqueueSnackbar('Deck name needs at least 1 nonspace character', { variant: 'error' })
      return false;
    }
    return true;
  }

  handleSubmit(event: any, user = this.userDocRef.get()) {
    event.preventDefault();

    let title: string = event.target.deckName.value;
    if (!this.isValidTitle(title)) {
      return;
    }

    firebase.firestore().collection('deck').add({
      deckName: event.target.deckName.value,
      deckDescription: event.target.deckDescription.value,
      deck: [],
      ownerID: this.props.user.uid
    })
      .then(function (deckRef) {
        console.log("Deck written with ID: " + deckRef.id);
      })

    console.log('values input into database: name=' + event.target.deckName.value + ', description=' + event.target.deckDescription.value);
    //TODO redirect back to DeckList here
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        className="innerForm">
        <h1>[CreateDeck]</h1>
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
        <input type="submit" />
      </form>
    );
  }
}

export default withSnackbar(CreateDeck);
