import React,{ Component } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import firebase from "firebase/app";

interface deckInfo {
  deckName: string;
  deckDescription: string;
  cards: string;
}

class CreateDeck extends React.Component<{ user: firebase.User }> {
  userDocRef: firebase.firestore.DocumentReference;
  constructor(props: Readonly<{ user: firebase.User }>) {
    super(props);
    this.userDocRef = firebase.firestore().collection("users").doc(this.props.user.uid);
    this.state = {value: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event:any, user = this.userDocRef.get()) {
    event.preventDefault();
    
    firebase.firestore().collection('deck').add({
        deckName:event.target.deckName.value,
        deckDescription:event.target.deckDescription.value,
        deck:[1,2,4,5]    
    })
    .then(function(deckRef) {
      alert("Deck written with ID: "+ deckRef.id);
      firebase.firestore().collection('user-decks').add({
        userID: user,
        deckID: deckRef.id
      });
      alert("userID=" + user + "deckID=" + deckRef.id);
    }) 

    alert('values input into database: name=' + event.target.deckName.value +', description='+ event.target.deckDescription.value);
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
          label="Required"
          defaultValue="Deck Name"
          margin="normal"
        />
          <br></br>
        <TextField
          id="deckDescription"
          placeholder="Deck Description"
          multiline
          rowsMax="4"
          margin="normal"
        />
        <br></br>
        <br></br>
        <input type="submit"/>
    </form>
    );
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 1000,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  }),
);

interface State {
    deckName: string;
    deckDescription: string;
    cards: string;
}

export default CreateDeck;
