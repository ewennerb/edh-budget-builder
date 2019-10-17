import { RouteComponentProps } from "react-router";
import React from "react";
import { DeckData } from "../common";
import firebase from "firebase/app";
import "firebase/firestore"
import { WithSnackbarProps } from "notistack";
import Async, { IfPending, IfFulfilled } from "react-async";

type PublicDeckDetailProps = RouteComponentProps<{ id: string }> & WithSnackbarProps;
class PublicDeckDetail extends React.Component<PublicDeckDetailProps> {
  deckDocRef: firebase.firestore.DocumentReference;
  loadPromise: () => Promise<DeckData>;
  constructor(props: Readonly<PublicDeckDetailProps>) {
    super(props);
    const deckId = props.match.params.id
    this.deckDocRef = firebase.firestore().collection('deck').doc(deckId)
    this.loadPromise = async () => {
      try {
        const doc = await this.deckDocRef.get();
        const deckData = doc.data();
        if (!deckData) throw new Error("deck document has no data")
        return deckData as DeckData
      } catch (err) {
        this.props.enqueueSnackbar('Could not get deck', { variant: 'error' });
        console.error("Error getting deck: ", err);
        throw err
      }
    }
  }

  checkEDHStatus = (deckData: DeckData) => {
    try {
      const cardCount = deckData.deck.length;
      if (cardCount === 100) {
        return (<h3>Deck is legal for EDH format</h3>)
      } else {
        return (<h3>Deck is illegal for EDH format. This deck has {cardCount} cards,
         but it must have 100 cards.</h3>)
      }
    } catch (err){
      this.props.enqueueSnackbar('Could not get deck length', {variant: 'error'});
      console.error("Error getting deck length: ", err);
      throw err;
    }
  }

  render() {
    return (
      <Async promiseFn={this.loadPromise}>
        {state =>
          <>
            <IfPending state={state}>
              <h1>Loading...</h1>
            </IfPending>
            <IfFulfilled state={state}>
              {data =>
                <>
                  <h1>{data.deckName}</h1>
                  <h3>{this.checkEDHStatus(data)}</h3>
                  <p style={{ whiteSpace: 'pre-wrap' }}>
                    {data.deckDescription}
                  </p>
                  <ul>
                    {data.deck.map(cardName => <li key={cardName}>{cardName}</li>)}
                  </ul>
                </>
              }
            </IfFulfilled>
          </>
        }
      </Async>
    )
  }
}

export default PublicDeckDetail;
