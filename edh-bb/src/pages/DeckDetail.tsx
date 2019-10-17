import { RouteComponentProps } from "react-router";
import React from "react";
import firebase from "firebase/app";
import "firebase/firestore"
import { WithSnackbarProps, withSnackbar } from "notistack";
import Async, { IfPending, IfFulfilled } from "react-async";
import { TextField, Button, IconButton, Tooltip } from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import update from 'immutability-helper';
import { DeckData, validateDeckName } from "../common";
import FileSaver from "file-saver";

type DeckDetailProps = RouteComponentProps<{ id: string }> & WithSnackbarProps;
interface LoadedData {
  deckId: string;
  deckData: DeckData;
}
class DeckDetail extends React.Component<DeckDetailProps> {
  deckDocRef: firebase.firestore.DocumentReference;
  loadPromise: () => Promise<LoadedData>;
  constructor(props: DeckDetailProps) {
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

  checkEDHStatus = (deckData: DeckData) => {
    try {
      const cardCount = deckData.deck.length;
      if (cardCount === 100) {
        return (<h3>Deck is legal for EDH format</h3>)
      } else {
        return (<h3>Deck is illegal for EDH format. You currently have {cardCount} cards,
         but you must have 100 cards.</h3>)
      }
    } catch (err){
      this.props.enqueueSnackbar('Could not get deck length', {variant: 'error'});
      console.error("Error getting deck length: ", err);
      throw err;
    }
  }

  copyDeck = async (deckData: DeckData) => {
    try {
      const newDeckRef = await firebase.firestore().collection('deck').add(
        update(deckData, { deckName: { $apply: oldName => oldName + '- copy' } }))
      console.log("Deck written with ID: " + newDeckRef.id);
      this.props.enqueueSnackbar('Created a copy')
      this.props.history.push('/deck-list')
    } catch (err) {
      this.props.enqueueSnackbar('Could not create a copy', { variant: 'error' });
      console.error("Error copying deck: ", err);
    }
  }

  showPublicUrl = (deckId: string) => {
    const publicUrl = new URL('/public-deck/' + deckId, window.location.href).href
    this.props.enqueueSnackbar(publicUrl)
  }

  deleteDeck = async () => {
    try {
      await this.deckDocRef.delete()
      this.props.enqueueSnackbar('Deck deleted')
      this.props.history.push('/deck-list')
    } catch (err) {
      this.props.enqueueSnackbar('Could delete deck', { variant: 'error' });
      console.error("Error deleting deck: ", err);
    }
  }

  deleteCardFromDeck = (deckData: DeckData, cardName: string) => {
    this.deckDocRef.update({
      deck: firebase.firestore.FieldValue.arrayRemove(cardName)
      });
    this.props.enqueueSnackbar(cardName + ' deleted from ' + deckData.deckName); 
    //TODO update list without refreshing page
    console.log(cardName + ' deleted from ' + deckData.deckName);
  }

  downloadDeck = (deckData: DeckData) => {
    const blob = new Blob([JSON.stringify(deckData)], {type: 'application/json'})
    FileSaver.saveAs(blob)
  }

  handleSubmit = (newDeck: DeckData) => async () => {
    if (validateDeckName(newDeck.deckName) === null) {
      try {
        await this.deckDocRef.set(newDeck)
        this.props.enqueueSnackbar('Saved changes');
      } catch (err) {
        this.props.enqueueSnackbar('Could not save changes', { variant: 'error' });
        console.log("Error saving deck details: ", err);
      }
    } else {
      this.props.enqueueSnackbar('Invalid deck title', { variant: 'error' })
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
              {data => {
                const deckName_error = validateDeckName(data.deckData.deckName);
                return (
                  <>
                    <h1>Deck Detail</h1>
                    <Tooltip title="Public URL">
                      <IconButton aria-label="public URL" onClick={() => this.showPublicUrl(data.deckId)}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Make a copy">
                      <IconButton aria-label="make a copy" onClick={() => this.copyDeck(data.deckData)}>
                        <FileCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete deck">
                      <IconButton aria-label="delete" onClick={this.deleteDeck}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download deck">
                      <IconButton aria-label="download" onClick={() => this.downloadDeck(data.deckData)}>
                        <GetAppIcon />
                      </IconButton>
                    </Tooltip>
                    <div>
                      <TextField
                        required
                        label="Deck Name"
                        id="deckName"
                        error={deckName_error != null}
                        helperText={deckName_error}
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
                    
                    {this.checkEDHStatus(data.deckData)}
                    
                    <ul>
                      {data.deckData.deck.map((cardName) => (
                        <ul key={cardName}>
                          <Tooltip title="Delete card">
                            <IconButton aria-label="delete-card" onClick={() => this.deleteCardFromDeck(data.deckData, cardName)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          {cardName}
                        </ul>
                      ))}
                    </ul>
                  </div>
                  </>
                );
              }}
            </IfFulfilled>
          </>
        }
      </Async>
    )
  }
}

export default withSnackbar(DeckDetail);
