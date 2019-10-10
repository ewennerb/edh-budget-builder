import { RouteComponentProps } from "react-router";
import React from "react";
import firebase from "firebase/app";
import "firebase/firestore"
import { WithSnackbarProps, withSnackbar } from "notistack";
import Async, { IfPending, IfFulfilled } from "react-async";
import { TextField, Button, IconButton, Popper, Fade, Paper } from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import update from 'immutability-helper';

type BetterDeckDetailProps = RouteComponentProps<{ id: string }> & WithSnackbarProps;
interface DeckData {
  deckName: string;
  deckDescription: string;
  deck: [string];
}
interface LoadedData {
  deckId: string;
  deckData: DeckData;
}
class BetterDeckDetail extends React.Component<BetterDeckDetailProps> {
  deckDocRef: firebase.firestore.DocumentReference;
  loadPromise: () => Promise<LoadedData>;
  constructor(props: Readonly<BetterDeckDetailProps>) {
    super(props);
    const deckId = props.match.params.id
    this.deckDocRef = firebase.firestore().collection('deck').doc(deckId)
    this.loadPromise = async () => {
      try {
        const doc = await this.deckDocRef.get();
        const deckData = doc.data();
        if (!deckData) throw new Error("deck document has no data")
        return { deckId: doc.id, deckData: deckData as DeckData }
      } catch (err) {
        this.props.enqueueSnackbar('Could not get deck', { variant: 'error' });
        console.error("Error getting deck: ", err);
        throw err
      }
    }
  }

  handleSubmit = (newDeck: DeckData) => async () => {
    try {
      await this.deckDocRef.set(newDeck)
      this.props.enqueueSnackbar('Saved changes');
    } catch (err) {
      this.props.enqueueSnackbar('Could not save changes', { variant: 'error' });
      console.log("Error saving deck details: ", err);
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
                  <h1>Deck Detail<ShareButton deckId={data.deckId} /></h1>
                  <div>
                    <TextField
                      required
                      id="deckName"
                      label="Deck Name"
                      value={data.deckData.deckName}
                      onChange={ev => state.setData(update(data, { deckData: { deckName: { $set: ev.target.value } } }))}
                    />
                    <br />
                    <TextField
                      id="deckDescription"
                      label="Deck Description"
                      multiline
                      rowsMax="4"
                      value={data.deckData.deckDescription}
                      onChange={ev => state.setData(update(data, { deckData: { deckDescription: { $set: ev.target.value } } }))}
                    />
                    <br />
                    <Button variant="contained" onClick={this.handleSubmit(data.deckData)}>Save Changes</Button>
                    <ul>
                      {data.deckData.deck.map(cardName => <li key={cardName}>{cardName}</li>)}
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

interface ShareButtonProps {
  deckId: string;
}
const ShareButton: React.FC<ShareButtonProps> = ({ deckId }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'share-url-popper' : undefined;
  // there doesn't appear to be a way to do this with react-router or history
  // so we're using the 'native' url api
  const publicUrl = new URL('/public-deck/' + deckId, window.location.href).href
  return (
    <>
      <IconButton aria-describedby={id} onClick={handleClick}><ShareIcon /></IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {publicUrl}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default withSnackbar(BetterDeckDetail);
