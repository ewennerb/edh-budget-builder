import React from "react";
import firebase from "firebase/app";
import Button from '@material-ui/core/Button';
import { Link, LinkProps } from 'react-router-dom';
import Async, { IfPending, IfFulfilled } from "react-async";
import { withSnackbar, WithSnackbarProps } from "notistack";

const AdapterLink = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <Link innerRef={ref} {...props} />
));

class DeckList extends React.Component<{ user: firebase.User } & WithSnackbarProps> {
  decksRef: firebase.firestore.CollectionReference;
  decks: any;
  queryRef: firebase.firestore.Query;
  loadPromise: () => Promise<firebase.firestore.QueryDocumentSnapshot[]>;

  constructor(props: Readonly<{ user: firebase.User } & WithSnackbarProps>) {
    super(props);
    this.decksRef = firebase.firestore().collection("deck");
    this.queryRef = this.decksRef.where('ownerID', '==', this.props.user.uid);
    this.loadPromise = async () => {
      try {
        const query = await this.queryRef.get();
        const data = query.docs;
        return data;
      } catch (err) {
        this.props.enqueueSnackbar('Could not get decks', { variant: 'error' });
        console.error("Error retrieving decks: ", err);
        throw err;
      }
    }
  }

  render() {
    return (
      <Async promiseFn={this.loadPromise}>
        {state =>
          <>
            <IfPending state={state}>
              <h1>Retrieving decks...</h1>
            </IfPending>
            <IfFulfilled state={state}>
              {decks => {
                if (decks.length <= 1) {
                  return (
                    <div>
                      <h1>Deck List</h1>
                      <h3>You have no decks.</h3>
                      <Button variant='contained' component={AdapterLink} to='/deck-list'>
                        Create Deck
                      </Button>
                    </div>
                  )
                } else {
                  return (
                    <>
                      <h1>Deck List</h1>
                      {console.log("Deck count: " + decks.length)}
                      <ul>
                        {
                          decks.map((deck, index) => {
                            console.log('Deck name: ' + deck.data().deckName + " description: " + deck.data().deckDescription);

                            return <li key={index}><Link to={'/deck-detail/' + deck.id}>{index + 1}: {deck.data().deckName}</Link></li>;

                          })
                        }
                      </ul>
                    </>
                  )
                }
              }}
            </IfFulfilled>
          </>
        }
      </Async>
    )
  }
}

export default withSnackbar(DeckList);
