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
  NativeSelect
} from '@material-ui/core'
import SearchBar from './store/components/SearchBar'
import Async, { IfFulfilled } from 'react-async';

const mtg = require("mtgsdk");
const jmespath = require("jmespath");
const _ = require("underscore");

class DropFields {
    currentDeck: any;
    userDecks: any;
}

var t = 0;

interface CardSearchState {searchQuery: Object, searchResults: Object, lenResults: number, deckField: DropFields}
interface CardSearchState { searchQuery: Object, searchResults: Object, lenResults: number, selectedDeck?: any, sortBy?: any }
class CardSearch extends React.Component<{ user: firebase.User } & WithSnackbarProps, CardSearchState> {
  decksRef: firebase.firestore.CollectionReference;
    decks: any;
    queryRef: firebase.firestore.Query;
    loadPromise: () => Promise<firebase.firestore.QueryDocumentSnapshot[]>;

    constructor(props: Readonly<{ user: firebase.User } & WithSnackbarProps>) {
        super(props);
        this.state = {
            searchQuery: {},
            searchResults: {results: []},
            lenResults: 0,
            deckField: {
                currentDeck: {},
                userDecks: []
            }
        };
        this.decksRef = firebase.firestore().collection("deck");
        this.queryRef = this.decksRef.where('ownerID', '==', this.props.user.uid);
    this.loadPromise = async () => {
      const query = await this.queryRef.get();
      const data = query.docs;
      return data;
    }
  }

    async getSearchParams(params: any) {
        console.log(params);
        console.log(this.state.sortBy)
        if (params !== {}) {
            var results = null;
            // @ts-ignore
            //TODO add search param here to filter out banned cards
            await mtg.card.where({name: params.cardName, orderBy: this.state.sortBy}).then(card => {
                results = card
            });
            const finalResult = _.uniq(results, function(r: any){ return r.name});

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

    handleChange(event: any){
        console.log(event.target.value);
        this.setState({
            deckField: {
                currentDeck: event.target.value as Object,
                userDecks: this.state.deckField.userDecks
            }
        });

        console.log(this.state.deckField.currentDeck);
        console.log(this.state.deckField.userDecks);
        this.render();
    }

    async mountDropDown() {
        const decks = await this.loadPromise();
        console.log("I am setting the state to default now");
        this.setState({
            deckField:
                {
                    currentDeck: {},
                    userDecks: decks
                }
        });
        return 1;
  }

  addToDeck(cardName: any) {
    const currID = this.state.deckField.currentDeck.id;
    const deckref = firebase.firestore().collection("deck").doc(currID);
    const arrUnion = deckref.update({ deck: firebase.firestore.FieldValue.arrayUnion(cardName) });
    console.log(arrUnion);
    //Todo: Return a snackbar message that says "Added <card> to deck!"
    return 0;
  }

  addToFavorites(cardName: any) {
    //Add check that card is not already in user's favorites
    const userRef = firebase.firestore().collection("users").doc(this.props.user.uid);
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
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <FormControl>
                    <InputLabel htmlFor="Sort By">Sort By</InputLabel>
                    <NativeSelect
                      onChange={(e) => this.setState({ sortBy: e.target.value })}
                    >

                      <option value="" />
                      <option value="price">Price</option>
                      <option value="power">Power</option>
                      <option value="toughness">Toughness</option>
                    </NativeSelect>

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
                        <Button onClick={this.addToFavorites.bind(this, value)} >
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
    render() {
        if (t === 0) {
            this.mountDropDown();
            t = 1;
        }

        const listVals = jmespath.search(this.state.searchResults, "results[*].name");

        var sc = document.createElement("script");
        sc.setAttribute("src", 'http://tappedout.net/tappedout.js');
        sc.setAttribute("type", "text/javascript");
        document.head.appendChild(sc);
        // @ts-ignore
        if (this.state.lenResults === 0){
            return (
                <div>
                    <InputLabel htmlFor="current-deck">Current Deck</InputLabel>
                    <Select
                        inputProps={{
                            id: 'current-deck',
                        }}
                        value={this.state.deckField.currentDeck}
                        onChange={this.handleChange.bind(this)}>
                        {this.state.deckField.userDecks.map((deck: any) => <MenuItem value={deck}>{deck.data().deckName}</MenuItem>)}
                    </Select>
                    <SearchBar searchQuery={this.getSearchParams.bind(this)}>Card Search</SearchBar>
                </div>
            );
        } else {
            return (
                <div>
                    <script src="http://tappedout.net/tappedout.js"></script>
                    <FormControl>
                        <InputLabel htmlFor="current-deck">Current Deck</InputLabel>
                        <InputLabel htmlFor="current-deck">Current Deck</InputLabel>
                        <Select
                            inputProps={{
                                id: 'current-deck',
                            }}
                            value={this.state.deckField.currentDeck}
                            onChange={this.handleChange.bind(this)}>
                            {this.state.deckField.userDecks.map((deck: any) => <MenuItem value={deck}>{deck.data().deckName}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <SearchBar searchQuery={this.getSearchParams.bind(this)}/>

                    <br />
                    <div>
                        <List dense>
                            {listVals.map((value: any) => {
                                const labelId = `list-item-${value}`;
                                return (
                                    <ListItem key={value} button>
                                        <ListItemText id={labelId} primary={<span className="mtgcard">`${value}`</span>} />
                                        <ListItemSecondaryAction>
                                            <Button
                                                onClick={this.addToDeck.bind(this, value)}
                                            >
                                                Add to Deck
                                            </Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            )
        }
    }
}

export default withSnackbar(CardSearch);