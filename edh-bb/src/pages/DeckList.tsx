import React from "react";

import { Link, LinkProps } from 'react-router-dom';
import Button from '@material-ui/core/Button';

import firebase from "./../index"

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));

class DeleteDeck extends React.Component { 

  deleteDeck(deckID:string){
    firebase.firestore().collection('deck').doc(deckID).delete()
    .then(function() {
      window.location.reload(false);
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }
    
 
}
const DeckList: React.FC = () => {
  // TODO
  const deleteDeckInstance = new DeleteDeck(""); 
  //deleteDeckInstance.deleteDeck("BFX0TlBsEKj4LcAQiqkD")
  return (
    <div>
      <h1>[DeckList]</h1>
  
      <Button color="primary" component={AdapterLink} to="/create-deck">
        Create New Deck
      </Button>

    </div>
    
  );
}

export default DeckList;
