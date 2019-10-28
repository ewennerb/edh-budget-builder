import { RouteComponentProps } from "react-router";
import React from "react";
import firebase from "firebase/app";
import "firebase/firestore"
import { WithSnackbarProps, withSnackbar } from "notistack";
import Async, { IfPending, IfFulfilled } from "react-async";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Tooltip,
  TableCell, TableRow, Table, TableBody
} from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import update from 'immutability-helper';
import { DeckData, validateDeckName } from "../common";
import FileSaver from "file-saver";

function count(arr: any, item: any) {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      count++;
    }
  }
  return count;
}

var ctr = 0;
const basicLands = [
    "Island",
    "Mountain",
    "Plains",
    "Swamp",
    "Forest",
    "Wastes"
];

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
      if (cardCount >= 100) {
        return (<h3 data-testid="legal">Deck is legal for EDH format. You currently have {cardCount} cards.</h3>)
      } else {
        return (<h3 data-testid="illegal">Deck is illegal for EDH format. You currently have {cardCount} cards,
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
        update(deckData, { deckName: { $apply: oldName => '' }, deckDescription: {$apply: oldDesc => ''} }))
      console.log("Deck written with ID: " + newDeckRef.id);
      this.props.enqueueSnackbar('Created a copy with name \'' + deckData.deckName + ' - copy\'')
      this.props.history.push('/deck-list')
    } catch (err) {
      this.props.enqueueSnackbar('Could not create a copy', { variant: 'error' });
      console.error("Error copying deck: ", err);
    }
  }

  showPublicUrl = (deckId: string) => {
    this.props.enqueueSnackbar('/public-deck/' + deckId)
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
    if (count(deckData.deck, cardName) > 1) {
      var i = deckData.deck.lastIndexOf(cardName);
      this.deckDocRef.update({deck: deckData.deck.splice(i, 1)});
      this.props.enqueueSnackbar(cardName + ' deleted from ' + deckData.deckName);
      //TODO update list without refreshing page
      console.log(cardName + ' deleted from ' + deckData.deckName);
      window.location.reload(true);
    } else {

      try {
        await this.deckDocRef.update({
          deck: firebase.firestore.FieldValue.arrayRemove(cardName)
        });
        this.props.enqueueSnackbar(cardName + ' deleted from ' + deckData.deckName);
        //TODO update list without refreshing page
        console.log(cardName + ' deleted from ' + deckData.deckName);
        window.location.reload(true);
      } catch (err) {
        this.props.enqueueSnackbar('Card no longer exists in deck', {variant: 'error'});
        console.error(cardName + " no longer exists in deck: ", err);
      }
    }
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

  deleteButton(){
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };
    return(
      <span>
      <Tooltip title="Delete deck">
        <IconButton aria-label="delete" onClick={handleClickOpen}>
            <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="confirmDelete"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Deck?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you would like to delete this deck?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="No" onClick={this.deleteDeck} color="primary">
            No
          </Button>
          <Button id="Yes" onClick={this.deleteDeck} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      </span>
    )
  }

  render() {
    var sc = document.createElement("script");
    sc.setAttribute("src", 'https://tappedout.net/tappedout.js');
    sc.setAttribute("type", "text/javascript");
    document.head.appendChild(sc);

    var row : any[] = [];
    var landIdx = {};
    basicLands.map((land: any) => {
      //@ts-ignore
      landIdx[land] = -1;
      return 0;
    });


    return (
        <div>
          <script src="https://tappedout.net/tappedout.js"></script>
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
                        <script src="https://tappedout.net/tappedout.js"></script>
                        <Box alignContent='center' p={1}  data-testid="deck-detail-flex">
                          <Box
                            justifyContent="left"
                            display="flex"
                            alignContent="center"
                            p={1}
                            marginLeft={20}
                            marginRight={20}
                            fontWeight="fontWeightBold"
                          >
                            <TextField
                              required
                              label="Deck Name"
                              id="deckName"
                              error={deckName_error != null}
                              helperText={deckName_error}
                              value={data.deckData.deckName}
                              inputProps={{
                                style: {fontSize: 16}
                              }}
                              variant="outlined"
                              onChange={ev => state.setData(update(data, { deckData: { deckName: { $set: ev.target.value } } }))}
                            />
                            <br />

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
                            {this.deleteButton()}
                            <Tooltip title="Download deck">
                              <IconButton aria-label="download" onClick={() => this.downloadDeck(data.deckData)}>
                                <GetAppIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <div>
                            <Box
                                justifyContent="center"
                                display="flex"
                                alignContent="center"
                                p={1}
                                marginLeft={20}
                                marginRight={20}>
                              <TextField
                                  id="deckDescription"
                                  label="Deck Description"
                                  multiline
                                  rowsMax="4"
                                  fullWidth
                                  variant="outlined"
                                  value={data.deckData.deckDescription}
                                  onChange={ev => state.setData(update(data, { deckData: { deckDescription: { $set: ev.target.value } } }))}
                              />
                              <br />
                              <br />
                            </Box>
                            <Box
                                justifyContent="right"
                                display="flex"
                                alignContent="right"
                                p={1}
                                marginLeft={20}
                                marginRight={20}
                            >
                              <Button variant="contained" onClick={this.handleSubmit(data.deckData)}>Save Changes</Button>
                            </Box>
                            {this.checkEDHStatus(data.deckData)}
                            <Box
                                justifyContent="left"
                                display="flex"
                                alignContent="center"
                                p={1}
                                marginLeft={7}
                                marginRight={7}
                                fontSize={18}>
                              Card List
                            </Box>
                            <Box
                                justifyContent="center"
                                display="flex"
                                alignContent="center"
                                p={1}
                                marginLeft={7}
                                marginRight={7}
                                fontSize={14}
                            >
                              <Table size='small' padding='none'>

                                <TableBody>
                                  {data.deckData.deck.map((cardName, index) => {
                                    // @ts-ignore

                                    if(basicLands.includes(cardName)){
                                      var templen = count(data.deckData.deck, cardName);
                                      console.log(templen);
                                      //@ts-ignore
                                      if(landIdx[cardName] === -1) {
                                        //@ts-ignore
                                        landIdx[cardName] = index;
                                        row.push(
                                            <TableCell component="th" scope="row" align='left' size='small' padding='checkbox'
                                                     style={{borderBottom: 'none'}}>
                                              <Tooltip title="Delete card">
                                                <IconButton aria-label="delete-card" data-testid={index}
                                                          onClick={() => this.deleteCardFromDeck(data.deckData, cardName)}><DeleteIcon/></IconButton>
                                              </Tooltip>
                                              <span className="mtgcard" id={cardName} data-testid={"($ `$" + cardName + "`)"}>($ `${cardName}`) x {templen}</span>
                                            </TableCell>
                                        );
                                      }
                                      ctr++;
                                      if(ctr === 4 || index === data.deckData.deck.length - 1) {
                                        ctr = 0;
                                        return (<TableRow>
                                          {row.pop()}
                                          {row.pop()}
                                          {row.pop()}
                                          {row.pop()}
                                        </TableRow>);
                                      }
                                      return 0;
                                        //@ts-ignore
                                    } else if(landIdx[cardName] === undefined) {
                                        row.push(
                                          <TableCell align='left' component="th" scope="row" size='small' padding='checkbox' style={{borderBottom: 'none'}}>
                                            <Tooltip title="Delete card">
                                              <IconButton aria-label="delete-card" data-testid={index} onClick={() => this.deleteCardFromDeck(data.deckData, cardName)}><DeleteIcon />
                                              </IconButton>
                                            </Tooltip>
                                            <span className="mtgcard" id={cardName} data-testid={"($ `$" + cardName + "`)"}>($ `${cardName}`)</span>
                                          </TableCell>
                                        );
                                        ctr++;
                                        if(ctr === 4 || index === data.deckData.deck.length - 1){
                                          ctr = 0;
                                          return(<TableRow>
                                              {row.pop()}
                                              {row.pop()}
                                              {row.pop()}
                                              {row.pop()}
                                          </TableRow>)
                                        }
                                      }return 0;
                                    }
                                    )
                                  }
                                </TableBody>
                              </Table>
                            </Box>

                          </div>
                        </Box>
                      </>
                  );
                }}
              </IfFulfilled>
            </>
          }
          </Async>
        </div>
    )
  }
}

export default withSnackbar(DeckDetail);
