import React from 'react'
import firebase from "firebase/app";
import { withSnackbar, WithSnackbarProps } from "notistack";
import {
  Button,
  FormControl,
  InputLabel,
  ListItem,
  List,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
} from '@material-ui/core'
import SearchBar from './store/components/SearchBar'
import Async, { IfFulfilled } from 'react-async';

const mtg = require("mtgsdk");
const jmespath = require("jmespath");
const _ = require("underscore");

interface CardSearchState { searchQuery: Object, searchResults: Object, lenResults: number, selectedDeck?: any }
class CardSearch extends React.Component<{ user: firebase.User } & WithSnackbarProps, CardSearchState> {
  loadPromise: () => Promise<firebase.firestore.QueryDocumentSnapshot[]>;
  constructor(props: Readonly<{ user: firebase.User } & WithSnackbarProps>) {
    super(props);
    this.state = {
      searchQuery: {},
      searchResults: { results: [] },
      lenResults: 0,
    };
    const queryRef = firebase.firestore().collection("deck").where('ownerID', '==', this.props.user.uid);
    this.loadPromise = async () => {
      const query = await queryRef.get();
      const data = query.docs;
      return data;
    }
  }

  async getSearchParams(params: any) {
    console.log(params);
    if (params !== {}) {
      var results = null;
      // @ts-ignore
      await mtg.card.where({ name: params.cardName }).then(card => {
        results = card
      });
      const finalResult = _.uniq(results, function (r: any) { return r.name });

      this.setState({
        searchQuery: params.cardName,
        //@ts-ignore
        searchResults: { results: finalResult },
        //@ts-ignore
        lenResults: finalResult.length,
      });

      this.render()
    }
  }

  handleChange(event: any) {
    console.log(event.target.value);
    this.setState({
      selectedDeck: event.target.value
    });
  }

  addToDeck(cardName: any) {
    const currID = this.state.selectedDeck.id;
    const deckref = firebase.firestore().collection("deck").doc(currID);
    const arrUnion = deckref.update({ deck: firebase.firestore.FieldValue.arrayUnion(cardName) });
    console.log(arrUnion);
    //Todo: Return a snackbar message that says "Added <card> to deck!"
    return 0;
  }

  addToFavorites(cardName: any) {
    //Add check that card is not already in user's favorites
    var userRef = firebase.firestore().collection("users").doc(this.props.user.uid);
    const arrUnion = userRef.update({
      favorites: firebase.firestore.FieldValue.arrayUnion(cardName)
    });
    console.log(arrUnion);
    this.props.enqueueSnackbar('Added ' + cardName + ' to your favorites!', { variant: 'success' })
  }

  render() {
    const listVals = jmespath.search(this.state.searchResults, "results[*].name");

    return (
      <div>
        <Async promiseFn={this.loadPromise}>
          {state =>
            <IfFulfilled state={state}>
              {decks =>
                <>
                  <FormControl>
                    <InputLabel htmlFor="current-deck">Current Deck</InputLabel>
                    <Select
                      inputProps={{ id: 'current-deck' }}
                      value={this.state.selectedDeck}
                      onChange={this.handleChange.bind(this)}>
                      {decks.map((deck: any) => <MenuItem value={deck}>{deck.data().deckName}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <SearchBar searchQuery={this.getSearchParams.bind(this)} />
                </>
              }
            </IfFulfilled>
          }
        </Async>
        {(this.state.lenResults !== 0) && (
          <>
            <br />
            <div>
              <List dense>
                {listVals.map((value: any) => {
                  const labelId = `list-item-${value}`;
                  return (
                    <ListItem key={value} button>
                      <ListItemText id={labelId} primary={`${value}`} />
                      <ListItemSecondaryAction>
                        <Button onClick={this.addToFavorites.bind(this, value)}>
                          Add to Favorites
                          </Button>
                        <Button onClick={this.addToDeck.bind(this, value)} >
                          Add to Deck
                          </Button>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withSnackbar(CardSearch);
