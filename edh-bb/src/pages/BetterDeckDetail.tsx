import { RouteChildrenProps } from "react-router";
import React from "react";
import firebase from "firebase/app";
import "firebase/firestore"
import { WithSnackbarProps, withSnackbar } from "notistack";
import Async, { IfPending, IfFulfilled } from "react-async";
import { TextField, Button } from "@material-ui/core";

type Props = RouteChildrenProps<{ id: string }> & WithSnackbarProps;
type DeckData = {
  deckName: string;
  deckDescription: string;
  deck: [string];
}
class BetterDeckDetail extends React.Component<Props> {
  /// undefined if `props.match` was null
  deckProps?: {
    deckDocRef: firebase.firestore.DocumentReference;
    loadPromise: () => Promise<DeckData>;
  };
  constructor(props: Readonly<Props>) {
    super(props);
    if (props.match) {
      const deckId = props.match.params.id
      const deckDocRef = firebase.firestore().collection('deck').doc(deckId)
      const loadPromise = async () => {
        try {
          const doc = await deckDocRef.get();
          const data = doc.data();
          if (!data) throw new Error("deck document has no data")
          return data as DeckData
        } catch (err) {
          this.props.enqueueSnackbar('Could not get deck', { variant: 'error' });
          console.error("Error getting deck: ", err);
          throw err
        }
      }
      this.deckProps = { deckDocRef, loadPromise }
    }
  }

  handleSubmit = (newDeck: DeckData) => async () => {
    if (!this.deckProps) throw new Error('no deck props')
    try {
      await this.deckProps.deckDocRef.set(newDeck)
      this.props.enqueueSnackbar('Saved changes');
    } catch (err) {
      this.props.enqueueSnackbar('Could not save changes', { variant: 'error' });
      console.log("Error saving deck details: ", err);
    }
  }

  render() {
    if (!this.deckProps) return "url doesn't have deck id"
    return (
      <Async promiseFn={this.deckProps.loadPromise}>
        {state =>
          <>
            <IfPending state={state}>
              <h1>Loading...</h1>
            </IfPending>
            <IfFulfilled state={state}>
              {deck =>
                <>
                  <h1>Deck Detail</h1>
                  <div>
                    <TextField
                      required
                      id="deckName"
                      label="Deck Name"
                      value={deck.deckName}
                      onChange={ev => state.setData({ ...deck, deckName: ev.target.value })}
                    />
                    <br />
                    <TextField
                      id="deckDescription"
                      label="Deck Description"
                      multiline
                      rowsMax="4"
                      value={deck.deckDescription}
                      onChange={ev => state.setData({ ...deck, deckDescription: ev.target.value })}
                    />
                    <br />
                    <Button variant="contained" onClick={this.handleSubmit(deck)}>Save Changes</Button>
                    <ul>
                      {deck.deck.map(cardName => <li key={cardName}>{cardName}</li>)}
                    </ul>
                  </div>
                </>
              }
            </IfFulfilled>
          </>
        }
      </Async>
    )
  }
}

export default withSnackbar(BetterDeckDetail);
