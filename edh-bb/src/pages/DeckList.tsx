import React from "react";
import firebase from "firebase/app";
import Button from '@material-ui/core/Button';
import { Link, LinkProps } from 'react-router-dom';

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));

class DeckList extends React.Component<{ user: firebase.User }> {
  decksRef: firebase.firestore.CollectionReference;
  decks: any;
  constructor(props: Readonly<{ user: firebase.User }>) {
    super(props);
    this.retrieveDecks = this.retrieveDecks.bind(this);
    this.decksRef = firebase.firestore().collection("deck");
  }

  retrieveDecks(){
    const queryRef = this.decksRef.where('ownerID', '==', this.props.user.uid);
    queryRef.get().then(doc => {
      if (doc.empty) {
        console.log('No decks, TODO render this');
      } else {
        console.log('OwnerID = ' + this.props.user.uid);
        console.log('You have ' + doc.size + ' decks');
        doc.docs.map((deck, index) => (
          console.log('Deck name: ' + deck.data().deckName + " description: " + deck.data().deckDescription)
        ));
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

  render() {
    this.retrieveDecks();
    return(
      <h1>[DeckList]</h1>
    );
  }
}
// class DeleteDeck extends React.Component { 

//   deleteDeck(deckID:string){
//     firebase.firestore().collection('deck').doc(deckID).delete()
//     .then(function() {
//       window.location.reload(true);
//     }).catch(function(error) {
//         console.error("Error removing document: ", error);
//     });
//   }
    
 
// }
  
 /*
* Test 8: When a user has a(n) existing deck(s), they should be able to see links to all decks.
* Test 9: When a user has no existing decks, they should see a message saying "You have no decks".
*/
  /*
const DeckList: React.FC = () => {
  // TODO
  //const deleteDeckInstance = new DeleteDeck(""); 
  //deleteDeckInstance.deleteDeck("BFX0TlBsEKj4LcAQiqkD")
  return (
    <div>
      <h2>You have no decks</h2>
      <Button variant='contained' component={AdapterLink} to='/create-deck'>
        Create a Deck
      </Button>
    </div>
    
  );

}
*/
export default DeckList;
