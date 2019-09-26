import React from 'react';
import TextField from '@material-ui/core/TextField';
import firebase from "firebase/app";
import { Link, LinkProps } from 'react-router-dom';

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));

interface deckInfo {
  deckName: string;
  deckDescription: string;
  cards: string;
}

class CreateDeck extends React.Component<{ user: firebase.User }> {
  constructor(props: Readonly<{ user: firebase.User }>) {
    super(props);
    this.state = {value: ''};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event:any) {
    event.preventDefault();
    
    firebase.firestore().collection('deck').add({
        deckName:event.target.deckName.value,
        deckDescription:event.target.deckDescription.value,
        deck:[],
        ownerID: this.props.user.uid
    })
    .then(function(deckRef) {
      console.log("Deck written with ID: "+ deckRef.id);
    }) 

    console.log('values input into database: name=' + event.target.deckName.value +', description='+ event.target.deckDescription.value);
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
            <input type="submit"/>
      </form>
    );
  }
}

export default CreateDeck;
