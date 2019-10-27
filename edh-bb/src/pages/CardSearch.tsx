import React from 'react'
import firebase from "firebase/app";
import { withSnackbar, WithSnackbarProps } from "notistack";
import {
    Button,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    Toolbar, FormControl
} from '@material-ui/core'
import SearchBar from './SearchBar'
import Async, { IfFulfilled } from 'react-async';
import { SearchOrder } from "../models/searchTerms"

const Scry = require("scryfall-sdk");

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


async function do_scryfall(params: any, results: []) {
    const opts = {
        unique: params.unique,
        order: params.order,
        include_extras: false,
        page: params.page
    };

    //@ts-ignore
    await Scry.Cards.search(params.q, opts).on("data", card => {
            //@ts-ignore
            results.push(card);
    }).waitForAll();
    console.log(results);
}

interface CardSearchState {searchQuery: Object, searchResults: any, lenResults: number, deckField: DropFields, searchOrder: SearchOrder}

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
            },
            searchOrder: SearchOrder.Name
        };
        this.decksRef = firebase.firestore().collection("deck");
        this.queryRef = this.decksRef.where('ownerID', '==', this.props.user.uid);
        this.loadPromise = async () => {
            const query = await this.queryRef.get();
            const data = query.docs;
            return data;
        }
    }

    public async getSearchParams(params: any) {

        this.setState({
                searchResults: {
                    results: []
                },
            }
        );

        console.log(params);
        if (this.state.searchOrder && params.order === undefined) {
            params.order = this.state.searchOrder;
        }
        const temp = {
            q: params.q,
            order: params.order,
            page: params.page,
            commanderIdentity: params.commanderIdentity,
            name: params.name,
            rarities: params.rarities,
            type: params.type,
            allowPartialTypeMatch: params.allowPartialTypeMatch,
            formats: params.formats,
        };

        console.log(params);
        if (params !== {}) {
            // @ts-ignore
            var results = [];
            // @ts-ignore
            // await Scry.Cards.search(params.q, params.order, params.unique, params.page).on("data", card => {
            //     results.push(card);
            // }).waitForAll();
            await do_scryfall(temp, results);
            this.setState({
                searchQuery: temp,
                //@ts-ignore
                searchResults: {results: results},
                //@ts-ignore
                lenResults: results.length + 1,
                //@ts-ignore
                searchOrder: temp.order
            });

            console.log(this.state);
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
    };

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

    addToFavorites(cardName: any) {
        //Add check that card is not already in user's favorites
        const userRef = firebase.firestore().collection("users").doc(this.props.user.uid);
        const arrUnion = userRef.update({
            favorites: firebase.firestore.FieldValue.arrayUnion(cardName)
        });
        console.log(arrUnion);
        this.props.enqueueSnackbar('Added ' + cardName + ' to your favorites!', { variant: 'success' })
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
                    if (!deckData) throw new Error("deck document has no data");
                    return deckData.deck;
                } catch (err) {
                    this.props.enqueueSnackbar('Could not get deck', {variant: 'error'});
                    console.error("Error getting deck: ", err);
                    throw err
                }
            };

            var x = await cardlist();

            if (!multiCards.includes(cardName) && x.includes(cardName)) {
                this.props.enqueueSnackbar('Only one copy of this card can exist in a deck', {variant: 'error'});
            } else {
                x.push(cardName);
                const arrUnion = deckref.update({deck: x});
                console.log(arrUnion);
                var msg = "Added " + cardName + " to deck";
                this.props.enqueueSnackbar(msg, {variant: 'success'});
            }
        }
        return 0;
    }

    fixFlipCards(value: any){
        if (value.layout === "transform" || value.layout === "flip" || value.layout === "meld") {
            const temp = value.name.split("//");
            const tempType = value.type_line.split(" // ");
            if (tempType.length === 2 && tempType[0] !== tempType[1]) {
                value.type_line = tempType[0] + " / " + tempType[1];
            } else if (tempType.length === 2 && tempType[0] === tempType[1]) {
                value.type_line = tempType[0];
            }
            return (
                <div>
                    <span className="mtgcard" id={temp[0]}>($ `${temp[0]}`)</span>
                    /
                    <span className="mtgcard" id={temp[1]}>($ `${temp[1]}`)</span>
                </div>
            );
        } else {
            return (
                <span className="mtgcard" id={value.name}>($ `${value.name}`)</span>
            );
        }
    }

    render() {
        if (t === 0) {
            var ss = document.createElement("link");
            ss.setAttribute("href", "https://www.foilking.dev/ts-scryfall/static/css/main.a2ec1a5b.css");
            ss.setAttribute("rel", "stylesheet");
            ss.setAttribute("type", "text/css");
            ss.setAttribute("accessKey", "search-css");
            document.head.appendChild(ss);
            this.mountDropDown();
            t = 1;
        }

        var sc = document.createElement("script");
        sc.setAttribute("src", 'https://tappedout.net/tappedout.js');
        sc.setAttribute("type", "text/javascript");
        document.head.appendChild(sc);
        var listVals = this.state.searchResults.results;
        // @ts-ignore
        return (
                <div>

                    <SearchBar searchQuery={this.getSearchParams.bind(this)}>Card Search</SearchBar>
                    {(this.state.lenResults !== 0) && (
                        <>
                            <br />
                            <div>
                                <script src="https://tappedout.net/tappedout.js"></script>
                                <Toolbar>
                                    <Async promiseFn={this.loadPromise}>
                                        {state =>
                                            <IfFulfilled state={state}>
                                                {decks =>
                                                    <>
                                                        <FormControl>
                                                                <InputLabel htmlFor="deck-select" data-testid="deck-select-test">
                                                                    Current Deck
                                                                </InputLabel>
                                                                <Select className="deck-select" id="deck-select"
                                                                        inputProps={{id: 'current-deck',}}
                                                                        value={this.state.deckField.currentDeck}
                                                                        onChange={this.handleChange.bind(this)}
                                                                        autoWidth
                                                                >
                                                                    {this.state.deckField.userDecks.map((deck: any) => <MenuItem
                                                                        value={deck}>{deck.data().deckName}</MenuItem>)}
                                                                </Select>
                                                        </FormControl>

                                                    </>
                                                }
                                            </IfFulfilled>
                                        }
                                    </Async>

                                </Toolbar>
                                <Table aria-label="card table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Card Name</TableCell>
                                            <TableCell>$ Price</TableCell>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Colors</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listVals.map((value: any) => {const labelId = `list-item-${value.name}`;
                                            var labelPrice = "";
                                            if (value.prices.usd === null || value.prices.usd === undefined || value.prices.usd === 0.00){
                                                labelPrice = "N/A";
                                                value.prices.usd = 0.00
                                            } else {
                                                labelPrice = "$" + value.prices.usd;
                                            }
                                            if (value.color_identity === []){
                                                value.color_identity.push('C');
                                            }
                                            return (
                                                <TableRow key={labelId}>
                                                    <TableCell component="th" scope="row">
                                                        {this.fixFlipCards(value)}
                                                    </TableCell>

                                                    <TableCell>{labelPrice}</TableCell>
                                                    <TableCell>{value.type_line}</TableCell>
                                                    <TableCell>
                                                        {value.color_identity.map((color: any) => {
                                                            if (color === 'R') {
                                                                return (<abbr className="card-symbol card-symbol-R"
                                                                              title="(R) Red">{`R`}</abbr>);
                                                            } else if (color === 'G') {
                                                                return (<abbr className="card-symbol card-symbol-G"
                                                                              title="(G) Green">{`G`}</abbr>);
                                                            } else if (color === 'B') {
                                                                return (<abbr className="card-symbol card-symbol-B"
                                                                              title="(B) Black">{`B`}</abbr>);
                                                            } else if (color === 'U') {
                                                                return (<abbr className="card-symbol card-symbol-U"
                                                                              title="(U) Blue">{`U`}</abbr>);
                                                            } else if (color === 'W') {
                                                                return (<abbr className="card-symbol card-symbol-W"
                                                                              title="(W) White">{`W`}</abbr>);
                                                            } else if (color === 'C' || color === null || color === undefined) {
                                                                return (<abbr className="card-symbol card-symbol-C"
                                                                              title="(C) Colorless">{`C`}</abbr>);
                                                            }
                                                        })
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button onClick={this.addToFavorites.bind(this, value.name)} >
                                                            Add to Favorites
                                                        </Button>
                                                        <Button onClick={this.addToDeck.bind(this, value.name)}>
                                                            Add to Deck
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                    })}
                                </TableBody>
                                </Table>
                            </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </>
                    )}
                </div>
            );
        }
        }

export default withSnackbar(CardSearch);
