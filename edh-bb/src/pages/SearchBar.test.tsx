import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import {render, waitForElement, getByLabelText, getByText, fireEvent} from '@testing-library/react'
import SearchBar from './SearchBar';
import getSearchParams from './CardSearch'
import { SnackbarProvider } from 'notistack';

jest.mock('firebase/app');
jest.mock('./SearchBar', () => ({})
const mockfirestore = new firebasemock.MockFirestore();
firebase.firestore = (() => mockfirestore) as any;

const testUser: firebase.User = { uid: "testUidAbc123" } as any;
const testDeck = {
    deck: [],
    deckDescription: "This is my test description",
    deckName: "Test Deck 1",
    ownerID: "testUidAbc123"
} as any;
firebase.firestore().collection("decks").add(testDeck);

const doRender = (user: firebase.User) => {
    const renderResult = render(<SnackbarProvider><SearchBar searchQuery={getSearchParams}/></SnackbarProvider>);
    mockfirestore.flush();
    return renderResult;
};

it('renders without crashing', async () => {
    const { container } = doRender(testUser);
    const name_field = await waitForElement(() => getByLabelText(container, "Card Name"), { container });
    const type_field = await waitForElement(() => getByLabelText(container, "Card Type"), { container });
    const color_field = await waitForElement(() => getByLabelText(container, "Color Identity"), {container});
    const rarity_field = await waitForElement(() => getByLabelText(container, "Rarity"), {container});
    const price_field = await waitForElement(() => getByLabelText(container, "Prices"), {container});
    const sort_field = await waitForElement(() => getByLabelText(container, "Sort By"), {container});
    const searchButt = getByText(container, "Search with these options");

    expect(name_field).toBeDefined();
    expect(type_field).toBeDefined();
    expect(color_field).toBeDefined();
    expect(rarity_field).toBeDefined();
    expect(price_field).toBeDefined();
    expect(sort_field).toBeDefined();
    expect(searchButt).toBeDefined();
});


it("builds the query correctly", async () => {
    const { container } = doRender(testUser);
    const name_field = await waitForElement(() => getByLabelText(container, "Card Name"), { container });
    const searchButt = getByText(container, "Search with these options");
    await fireEvent.change(name_field, {target: {"value": "Morophon"}});
    await fireEvent.click(searchButt);
    expect
})


//
// describe("SearchBar component", async () => {
//     test("renders", () => {
//         const wrapper = shallow(<SearchBar searchQuery={getSearchParams}/>);
//         expect(wrapper.exists()).toBe(true);
//     });
//
//     test("when the form is submitted, fire a query", () => {
//         const onSearchMock = jest.fn();
//         const wrapper = shallow(<SearchBar searchQuery={getSearchParams}/>);
//         // const container = wrapper.instance();
//         const event = {
//             preventDefault() {}
//         }
//         wrapper.find("button").simulate("click");
//         expect(wrapper.get)
//
//     });
// });
//

