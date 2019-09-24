import React from 'react'
import SearchBar from './store/components/SearchBar'
import {ListItem, List, ListItemText} from '@material-ui/core'

const mtg = require("mtgsdk");
const jmespath = require("jmespath");
const _ = require("underscore");

interface CardSearchProps {}
interface CardSearchState {searchQuery: Object, searchResults: Object, lenResults: number}


class CardSearch extends React.Component<CardSearchProps, CardSearchState> {
    // @ts-ignore
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: {},
            searchResults: {results: []},
            lenResults: 0
        };
    }

    // @ts-ignore
    async getSearchParams(params) {
        console.log(params);
        if (params !== {}) {

            var results = null;
            // @ts-ignore
            await mtg.card.where({name: params.cardName}).then(card => {
                results = card
            });

            const finalResult = _.uniq(results, function(r: any){ return r.name});
            this.setState({
                searchQuery: params.cardName,

                //@ts-ignore
                searchResults: {results: finalResult},
                //@ts-ignore
                lenResults: finalResult.length,
            });
            this.render()
        }
    }


    render() {

        const listVals = jmespath.search(this.state.searchResults, "results[*].name");

        // @ts-ignore
        if (this.state.lenResults === 0){
            return (
                <div>
                    // @ts-ignore
                    <SearchBar searchQuery={this.getSearchParams.bind(this)}/>
                </div>
            );
        } else {

            return (
                <div>
                    // @ts-ignore
                    <SearchBar searchQuery={this.getSearchParams.bind(this)}/>
                    <br />
                    <div>
                        <List dense>
                            {listVals.map((value: any) => {
                                const labelId = `list-item-${value}`;
                                return (
                                    <ListItem key={value} button>
                                        <ListItemText id={labelId} primary={`${value}`} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                </div>
            )
        }
    }
}

export default CardSearch;