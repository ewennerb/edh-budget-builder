import React from 'react'
import { Color, SearchTerms, SearchOrder } from '../models/searchTerms'

interface SearchProps {
    searchTerms: SearchTerms
    searchQuery: any;
}

interface SearchState {
    searchTerms: SearchTerms
}

class SearchBar extends React.Component<SearchProps, SearchState> {
    public static defaultProps = {
        searchTerms: {
            q: "",
            order: SearchOrder.Name,
            page: 1,
            name: "",
            type: "",
            allowPartialTypeMatch: true,
            formats: [],
            commanderIdentity: [],
            rarities: []
        }
    };

    constructor(props: SearchProps) {
        super(props);
        this.state = {
            searchTerms: props.searchTerms
        };

    }
    handleSubmit(values: any){
        //@ts-ignore
        this.props.searchQuery(values);
    }

    public render() {
        const { searchTerms } = this.state;

        // @ts-ignore
        return (
            <div className="form-layout advanced-search">
                <input name="utf8" value="✓" type="hidden" />
                <div className="inner-flex">
                    <div className="form-row">

                        <label className="form-row-label" htmlFor="name">
                            <svg aria-hidden="true" focusable="false" className="" width="33" height="24" viewBox="0 0 33 24" xmlns="http://www.w3.org/2000/svg"><g fillRule="evenodd"></g></svg>
                            Card Name
                        </label>
                        <div className="form-row-content">
                            <div className="form-row-content-band">
                                <input name="name" id="name" className="form-input" placeholder="Any words in the name, e.g. “Fire”" type="text" defaultValue={searchTerms.name} onChange={event => this.onFieldChange(event.currentTarget.name, event.currentTarget.value)}  />
                            </div>
                        </div>

                    </div>

                    <div className="form-row">

                        <label className="form-row-label" htmlFor="type">
                            <svg aria-hidden="true" focusable="false" className="" width="32" height="31" viewBox="0 0 32 31" xmlns="http://www.w3.org/2000/svg"><g fillRule="evenodd"></g></svg>
                            Card Type
                        </label>
                        <div className="form-row-content">
                            <div className="form-row-content-band">
                                <input name="type" id="type" className="form-input" placeholder="Enter any card types, e.g. “legendary”" type="text" value={searchTerms.type} onChange={event => this.onFieldChange(event.currentTarget.name, event.currentTarget.value)} />
                            </div>

                            <div className="form-row-content-band">
                                <label className="advanced-search-checkbox">
                                    <input name="allowPartialTypeMatch" id="allowPartialTypeMatch" defaultChecked={!!searchTerms.allowPartialTypeMatch} type="checkbox" onChange={event => this.onCheckboxChange(event.currentTarget.name, event.currentTarget.checked)} />
                                    Allow partial type matches
                                </label>
                            </div>
                            <p className="form-row-tip">
                                Enter any card type, supertype, or subtype to match, in any order.
                                Prefix a word with "-" to negate.
                            </p>
                        </div>

                    </div>

                    <div className="form-row">

                        <label className="form-row-label short">
                            <svg aria-hidden="true" focusable="false" className="" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"></svg>
                            Color Identity
                        </label>
                        <div className="form-row-content">

                            <fieldset>
                                <legend className="visuallyhidden">Commander colors</legend>
                                <div className="form-row-content-band">
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="commanderIdentity" id="false" value={Color.WHITE} type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        <abbr className="card-symbol card-symbol-W" title="one white mana">{`W`}</abbr>
                                        White
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="commanderIdentity" id="false" value={Color.BLUE} type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        <abbr className="card-symbol card-symbol-U" title="one blue mana">{`U`}</abbr>
                                        Blue
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="commanderIdentity" id="false" value={Color.BLACK} type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        <abbr className="card-symbol card-symbol-B" title="one black mana">{`B`}</abbr>
                                        Black
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="commanderIdentity" id="false" value={Color.RED} type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        <abbr className="card-symbol card-symbol-R" title="one red mana">{`R`}</abbr>
                                        Red
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="commanderIdentity" id="false" value={Color.GREEN} type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        <abbr className="card-symbol card-symbol-G" title="one green mana">{`G`}</abbr>
                                        Green
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="commanderIdentity" id="false" value={Color.COLORLESS} type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        <abbr className="card-symbol card-symbol-C" title="one colorless mana">{`C`}</abbr>
                                        Colorless
                                    </label>
                                </div>
                            </fieldset>

                        </div>

                    </div>

                    <div className="form-row">

                        <label className="form-row-label short">
                            <svg aria-hidden="true" focusable="false" className="" width="32" height="31" viewBox="0 0 32 31" xmlns="http://www.w3.org/2000/svg"></svg>
                            Rarity
                        </label>
                        <div className="form-row-content">

                            <fieldset>
                                <legend className="visuallyhidden">Desired rarities</legend>
                                <div className="form-row-content-band">
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="rarities" id="false" value="c" type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)}  />
                                        Common
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="rarities" id="false" value="u" type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        Uncommon
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="rarities" id="false" value="r" type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        Rare
                                    </label>
                                    <label className="advanced-search-checkbox small-columns">
                                        <input name="rarities" id="false" value="m" type="checkbox" onChange={event => this.onMultiCheckboxChange(event.currentTarget.name, event.currentTarget.value)} />
                                        Mythic Rare
                                    </label>
                                </div>
                            </fieldset>

                            <p className="form-row-tip">
                                Only return cards of the selected rarities.
                            </p>

                        </div>

                    </div>
                    <div className="form-row">

                        <label className="form-row-label" htmlFor="is">
                            <svg aria-hidden="true" focusable="false" className="" width="33" height="32" viewBox="0 0 33 32" xmlns="http://www.w3.org/2000/svg"></svg>
                            Criteria
                        </label>
                        <div className="form-row-content">

                            <div className="form-row-content-band">
                                <label className="visuallyhidden" htmlFor="block">Block or Group</label>
                                <input name="is[]" value="" type="hidden" />
                                <select name="is[]" id="is" multiple={true} data-component="advanced-search-autocomplete" data-placeholder="Enter a criteria or choose from the list" tabIndex={-1} className="select2-hidden-accessible" aria-hidden="true">
                                    <option value="promo">Promo</option>
                                    <option value="digital">Digital</option>
                                    <option value="reprint">Reprint</option>
                                    <option value="firstprint">Firstprint</option>
                                    <option value="firstprinting">Firstprinting</option>
                                    <option value="onlyprint">Onlyprint</option>
                                    <option value="onlyprinting">Onlyprinting</option>
                                    <option value="unique">Unique</option>
                                    <option value="extra">Extra</option>
                                    <option value="old">Old</option>
                                    <option value="modern">Modern</option>
                                    <option value="new">New</option>
                                    <option value="future">Future</option>
                                    <option value="futureshifted">Futureshifted</option>
                                    <option value="hires">Hires</option>
                                    <option value="highres">Highres</option>
                                    <option value="spotlight">Spotlight</option>
                                    <option value="vanilla">Vanilla</option>
                                    <option value="spell">Spell</option>
                                    <option value="permanent">Permanent</option>
                                    <option value="splitmana">Splitmana</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="hybridmana">Hybridmana</option>
                                    <option value="commander">Commander</option>
                                    <option value="masterpiece">Masterpiece</option>
                                    <option value="transform">Transform</option>
                                    <option value="doublesided">Doublesided</option>
                                    <option value="doublefaced">Doublefaced</option>
                                    <option value="split">Split</option>
                                    <option value="flip">Flip</option>
                                    <option value="meld">Meld</option>
                                    <option value="leveler">Leveler</option>
                                    <option value="token">Token</option>
                                    <option value="bikeland">Bikeland</option>
                                    <option value="bob">Bob</option>
                                    <option value="bounceland">Bounceland</option>
                                    <option value="checkland">Checkland</option>
                                    <option value="dual">Dual</option>
                                    <option value="etb">Etb</option>
                                    <option value="fastland">Fastland</option>
                                    <option value="fetchland">Fetchland</option>
                                    <option value="filterland">Filterland</option>
                                    <option value="finkel">Finkel</option>
                                    <option value="funny">Funny</option>
                                    <option value="gainland">Gainland</option>
                                    <option value="gary">Gary</option>
                                    <option value="mom">Mom</option>
                                    <option value="painland">Painland</option>
                                    <option value="pikula">Pikula</option>
                                    <option value="reserved">Reserved</option>
                                    <option value="scryland">Scryland</option>
                                    <option value="shadowland">Shadowland</option>
                                    <option value="shockland">Shockland</option>
                                    <option value="storageland">Storageland</option>
                                    <option value="tangoland">Tangoland</option>
                                    <option value="tron">Tron</option>
                                    <option value="useless">Useless</option>
                                    <option value="cute">Cute</option>
                                    <option value="fullart">Fullart</option>
                                    <option value="colorshifted">Colorshifted</option>
                                    <option value="timeshifted">Timeshifted</option>
                                    <option value="futureshifted">Futureshifted</option>
                                    <option value="release">Release</option>
                                    <option value="prerelease">Prerelease</option>
                                    <option value="buyabox">Buyabox</option>
                                    <option value="giftbox">Giftbox</option>
                                    <option value="league">League</option>
                                    <option value="draftweekend">Draftweekend</option>
                                    <option value="openhouse">Openhouse</option>
                                    <option value="planeswalkerdeck">Planeswalkerdeck</option>
                                    <option value="intropack">Intropack</option>
                                    <option value="-promo">-Promo</option>
                                    <option value="-digital">-Digital</option>
                                    <option value="-reprint">-Reprint</option>
                                    <option value="-firstprint">-Firstprint</option>
                                    <option value="-firstprinting">-Firstprinting</option>
                                    <option value="-onlyprint">-Onlyprint</option>
                                    <option value="-onlyprinting">-Onlyprinting</option>
                                    <option value="-unique">-Unique</option>
                                    <option value="-extra">-Extra</option>
                                    <option value="-old">-Old</option>
                                    <option value="-modern">-Modern</option>
                                    <option value="-new">-New</option>
                                    <option value="-future">-Future</option>
                                    <option value="-futureshifted">-Futureshifted</option>
                                    <option value="-hires">-Hires</option>
                                    <option value="-highres">-Highres</option>
                                    <option value="-spotlight">-Spotlight</option>
                                    <option value="-vanilla">-Vanilla</option>
                                    <option value="-spell">-Spell</option>
                                    <option value="-permanent">-Permanent</option>
                                    <option value="-splitmana">-Splitmana</option>
                                    <option value="-hybrid">-Hybrid</option>
                                    <option value="-hybridmana">-Hybridmana</option>
                                    <option value="-commander">-Commander</option>
                                    <option value="-masterpiece">-Masterpiece</option>
                                    <option value="-transform">-Transform</option>
                                    <option value="-doublesided">-Doublesided</option>
                                    <option value="-doublefaced">-Doublefaced</option>
                                    <option value="-split">-Split</option>
                                    <option value="-flip">-Flip</option>
                                    <option value="-meld">-Meld</option>
                                    <option value="-leveler">-Leveler</option>
                                    <option value="-token">-Token</option>
                                    <option value="-bikeland">-Bikeland</option>
                                    <option value="-bob">-Bob</option>
                                    <option value="-bounceland">-Bounceland</option>
                                    <option value="-checkland">-Checkland</option>
                                    <option value="-dual">-Dual</option>
                                    <option value="-etb">-Etb</option>
                                    <option value="-fastland">-Fastland</option>
                                    <option value="-fetchland">-Fetchland</option>
                                    <option value="-filterland">-Filterland</option>
                                    <option value="-finkel">-Finkel</option>
                                    <option value="-funny">-Funny</option>
                                    <option value="-gainland">-Gainland</option>
                                    <option value="-gary">-Gary</option>
                                    <option value="-mom">-Mom</option>
                                    <option value="-painland">-Painland</option>
                                    <option value="-pikula">-Pikula</option>
                                    <option value="-reserved">-Reserved</option>
                                    <option value="-scryland">-Scryland</option>
                                    <option value="-shadowland">-Shadowland</option>
                                    <option value="-shockland">-Shockland</option>
                                    <option value="-storageland">-Storageland</option>
                                    <option value="-tangoland">-Tangoland</option>
                                    <option value="-tron">-Tron</option>
                                    <option value="-useless">-Useless</option>
                                    <option value="-cute">-Cute</option>
                                    <option value="-fullart">-Fullart</option>
                                    <option value="-colorshifted">-Colorshifted</option>
                                    <option value="-timeshifted">-Timeshifted</option>
                                    <option value="-futureshifted">-Futureshifted</option>
                                    <option value="-release">-Release</option>
                                    <option value="-prerelease">-Prerelease</option>
                                    <option value="-buyabox">-Buyabox</option>
                                    <option value="-giftbox">-Giftbox</option>
                                    <option value="-league">-League</option>
                                    <option value="-draftweekend">-Draftweekend</option>
                                    <option value="-openhouse">-Openhouse</option>
                                    <option value="-planeswalkerdeck">-Planeswalkerdeck</option>
                                    <option value="-intropack">-Intropack</option>
                                </select>
                                <span className="select2 select2-container select2-container--default" dir="ltr">
                                    <span className="selection">
                                        <span className="select2-selection select2-selection--multiple" aria-haspopup="true" aria-expanded="false" tabIndex={-1}>
                                            <ul className="select2-selection__rendered">
                                                <li className="select2-search select2-search--inline">
                                                    <input className="select2-search__field" tabIndex={0} role="textbox" aria-autocomplete="list" placeholder="Enter a criteria or choose from the list" type="search" />
                                                </li>
                                            </ul>
                                        </span>
                                    </span>
                                    <span className="dropdown-wrapper" aria-hidden="true" />
                                </span>
                            </div>

                            <div className="form-row-content-band">
                                <label className="advanced-search-checkbox">
                                    <input name="is_partial" id="is_partial" value="1" type="checkbox" />
                                    Allow partial criteria matches
                                </label>
                            </div>

                            <p className="form-row-tip">
                                Enter any card criteria to match, in any order. Prefix a term with "-" to negate.
                            </p>

                        </div>

                    </div>
                    <div className="form-row">

                        <label className="form-row-label">
                            <svg aria-hidden="true" focusable="false" className="" width="33" height="30" viewBox="0 0 33 30" xmlns="http://www.w3.org/2000/svg"></svg>
                            Prices
                        </label>
                        <div className="advanced-search-row-content js-advanced-search-duplicant">

                            <div className="form-row-content-band js-advanced-search-duplicant-template">
                                <select className="form-input auto" name="price_1_mode" id="price_1_mode">
                                    <option value="<">less than</option>
                                    <option value=">">greater than</option>
                                    <option value="<=">less than or equal to</option>
                                    <option value=">=">greater than or equal to</option>
                                </select>
                                <label className="visuallyhidden" htmlFor="price_1_value">Currency 1 value</label>
                                <input name="price_1_value" id="price_1_value" className="form-input auto" placeholder="Any value, e.g. “15.00”" pattern="d*" type="number" />
                            </div>

                            <p className="form-row-tip js-advanced-search-row-tip">
                                Restrict cards based on their price.
                            </p>

                        </div>

                    </div>

                    <div className="form-row">

                        <label className="form-row-label">
                            <svg aria-hidden="true" focusable="false" className="" width="31" height="32" viewBox="0 0 31 32" xmlns="http://www.w3.org/2000/svg"></svg>
                            Sort By
                        </label>
                        <div className="form-row-content">

                            <div className="form-row-content-band">
                                <label className="visuallyhidden" htmlFor="order">Order</label>
                                <select className="form-input auto" name="order" id="order" onChange={event => this.onFieldChange(event.currentTarget.name, event.currentTarget.value)}>
                                    <option value="">Name</option>
                                    <option value="set">Set/Number</option>
                                    <option value="rarity">Rarity</option>
                                    <option value="color">Color</option>
                                    <option value="usd">Price</option>
                                    <option value="cmc">Converted Mana Cost</option>
                                    <option value="power">Power</option>
                                    <option value="toughness">Toughness</option>
                                    <option value="edhrec">EDHREC Rank</option>
                                </select>
                            </div>

                        </div>

                    </div>
                    <div className="form-row">
                        <div className="form-row-label" />
                        <div className="form-row-content">
                            <div className="form-row-content-band">
                                <button type="submit" className="button-primary-large" onClick={event => this.submitButtonClicked()}>
                                    Search with these options
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private submitButtonClicked() {
        this.handleSubmit(this.buildQueryAndSearch())
    }

    private onFieldChange(fieldName: string, fieldValue: string) {
        // @ts-ignore
        const newSearchTerms = {...this.state.searchTerms, [fieldName]: fieldValue};
        this.setState({searchTerms: newSearchTerms});
    }

    private onJoinerDropdownFieldChange(targetName: string, addValue: string) {
        // @ts-ignore
        const field = this.state.searchTerms[targetName];
        const fieldValue = field ? field + addValue : addValue;
        // @ts-ignore
        const newSearchTerms = {...this.state.searchTerms, [targetName]: fieldValue};
        this.setState({searchTerms: newSearchTerms});
    }

    private onCheckboxChange(fieldName: string, checked: boolean) {
        // @ts-ignore
        const newSearchTerms = {...this.state.searchTerms, [fieldName]: checked};
        this.setState({searchTerms: newSearchTerms});
    }

    private onMultiCheckboxChange(fieldName: string, fieldValue: any) {
        //@ts-ignore
        const field = this.state.searchTerms[fieldName] as any[];
        const fieldIndex = field.indexOf(fieldValue);
        if (fieldIndex > -1) {
            field.splice(fieldIndex, 1);
        } else {
            field.push(fieldValue);
        }
        // @ts-ignore
        const newSearchTerms = {...this.state.searchTerms, [fieldName]: field};
        this.setState({searchTerms: newSearchTerms});
    }

    private buildQueryAndSearch() {
        const { searchTerms } = this.state;
        let searchQueryArray = [];

        // Pushes Card Name Onto Query Array
        // @ts-ignore
        if (searchTerms.name) {
            // @ts-ignore
            searchQueryArray.push(this.splitWords(searchTerms.name.split(' ')));
        }

        // Pushes Card Type Onto the Query Array
        // @ts-ignore
        if (searchTerms.type) {
            // @ts-ignore
            searchQueryArray.push(this.splitWords(searchTerms.type.split(' '), 't:', searchTerms.allowPartialTypeMatch));
        }

        //TODO: Figure out what the code for EDH is
        // @ts-ignore
        if (searchTerms.formats && searchTerms.formats.length > 0) {
            // @ts-ignore
            searchQueryArray.push('f:commander');
        }

        // Pushes Card's Color Identity Onto Query Array
        // @ts-ignore
        if (searchTerms.commanderIdentity && searchTerms.commanderIdentity.length > 0) {
            // @ts-ignore
            searchQueryArray.push(this.splitWords(searchTerms.commanderIdentity, 'ids≤', true));
        }
        // @ts-ignore
        if (searchTerms.rarities && searchTerms.rarities.length > 0) {
            // @ts-ignore
            searchQueryArray.push(this.splitWords(searchTerms.rarities, 'r:', true));
        }

        const q = searchQueryArray.join(' ').trim();
        console.log(q);
        // @ts-ignore
        const newSearchTerms = { ...this.state.searchTerms, q, page: 1, order: SearchOrder.Name };
        //
        // this.props.fetchFilteredCards(newSearchTerms);
        // this.props.history.push('/cards/' + q);
        return newSearchTerms
    }

    private splitWords(searchTerm: string[], prefix: string = '', conditional: boolean = false): string {
        let searchTerms = [] as string[];
        let inclusiveArray = [] as string[];
        let exclusiveArray = [] as string[];

        searchTerm.forEach(element => {
            if (element.startsWith('-')) {
                exclusiveArray.push('-' + prefix + element.substr(1));
            } else {
                inclusiveArray.push(prefix + element);
            }
        });

        // Turn off conditional if there's any exclusion
        conditional = conditional && exclusiveArray.length === 0;

        if (exclusiveArray.length > 1) {
            const types = conditional ? exclusiveArray.join(' OR ') :  exclusiveArray.join(' ');
            searchTerms.push('(' + types + ')');
        } else {
            searchTerms.push(exclusiveArray[0]);
        }

        if (inclusiveArray.length > 1) {
            const types = conditional ? inclusiveArray.join(' OR ') :  inclusiveArray.join(' ');
            searchTerms.push('(' + types + ')');
        } else {
            searchTerms.push(inclusiveArray[0]);
        }
        return searchTerms.join(' ');
    }

}

export default SearchBar;