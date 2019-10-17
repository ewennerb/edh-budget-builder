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
import SearchBar from './SearchBar'

// const mtg = require("mtgsdk");
const Scry = require("scryfall-sdk");
// const jmespath = require("jmespath");
// const _ = require("underscore");

class DropFields {
    currentDeck: any;
    userDecks: any;
}

var t = 0;
const multiCards = [
    "Island",
    "Mountain",
    "Swamp",
    "Forest",
    "Plains",
    "Relentless Rats",
    "Rat Colony",
    "Persistent Petitioners",
    "Shadowborn Apostle"
];

interface CardSearchState {searchQuery: Object, searchResults: any, lenResults: number, deckField: DropFields}

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
        if (params !== {}) {
            // @ts-ignore
            var results = [];
            // @ts-ignore
            await Scry.Cards.search(params.q, params.order, params.unique, params.page).on("data", card => {
                results.push(card);
            }).waitForAll();
            this.setState({
                searchQuery: params,
                //@ts-ignore
                searchResults: {results: results},
                //@ts-ignore
                lenResults: results.length + 1,
            });

            console.log(this.state);
            this.render();
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

    async addToDeck(cardName: any){
        const currID = this.state.deckField.currentDeck.id;
        if (currID === undefined){
            this.props.enqueueSnackbar('No deck currently selected', {variant: 'error'});
            console.error("Error getting deck: ");
        } else {

            const deckref = firebase.firestore().collection("deck").doc(currID);
            const cardlist = async () => {
                try {
                    const doc = await deckref.get();
                    const deckData = doc.data();
                    if (!deckData) throw new Error("deck document has no data")
                    return deckData.deck;
                } catch (err) {
                    this.props.enqueueSnackbar('Could not get deck', {variant: 'error'});
                    console.error("Error getting deck: ", err);
                    throw err
                }
            }

            var x = await cardlist()

            if (!multiCards.includes(cardName) && x.includes(cardName)) {
                this.props.enqueueSnackbar('Only one copy of this card can exist in a deck', {variant: 'error'});
            } else {
                const arrUnion = deckref.update({deck: firebase.firestore.FieldValue.arrayUnion(cardName)});
                console.log(arrUnion);
                var msg = "Added " + cardName + "to deck";
                this.props.enqueueSnackbar(msg, {variant: 'success'});
            }
        }


        return 0;
    }


    render() {
        if (t === 0) {
            var ss = document.createElement("link");
            ss.setAttribute("href", "https://www.foilking.dev/ts-scryfall/static/css/main.a2ec1a5b.css");
            ss.setAttribute("rel", "stylesheet")
            ss.setAttribute("type", "text/css")
            document.head.appendChild(ss);
            this.mountDropDown();
            t = 1;
        }

        var sc = document.createElement("script");
        sc.setAttribute("src", 'http://tappedout.net/tappedout.js');
        sc.setAttribute("type", "text/javascript");
        document.head.appendChild(sc);
        var listVals = this.state.searchResults.results

        // @ts-ignore
        if (this.state.lenResults === 0){
            console.log("Nothing Was Found")
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
                                const labelId = `list-item-${value.name}`;
                                return (
                                    <ListItem key={value} button>
                                        <ListItemText id={labelId} primary={
                                            <div>
                                                <span className="mtgcard">($ `${value.name}`)</span>&emsp;&emsp;
                                                <span> &emsp;{value.prices.usd}</span>
                                            </div>}/>
                                        <ListItemSecondaryAction>
                                            <Button onClick={this.addToDeck.bind(this, value.name)}>Add to Deck</Button>
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