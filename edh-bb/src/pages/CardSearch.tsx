import React from 'react'
import SearchBar from './store/components/SearchBar'

const mtg = require("mtgsdk");
const jmespath = require("jmespath");

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

            this.setState({
                searchQuery: params.cardName,

                //@ts-ignore
                searchResults: {results: results},
                //@ts-ignore
                lenResults: results.length,
            });
            this.render()
        }
    }


    render() {
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
                    <div>
                        {jmespath.search(this.state.searchResults, "results[*].name")}
                        <br />
                        <br />
                    </div>
                </div>
            )
        }
    }
}

export default CardSearch;