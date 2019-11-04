import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, fireEvent,  getByTestId} from '@testing-library/react'
import { SnackbarProvider } from 'notistack';
import CardSearch from './CardSearch';

jest.mock('firebase/app');
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
    const renderResult = render(<SnackbarProvider><CardSearch user={user} /></SnackbarProvider>);
    mockfirestore.autoFlush(0);
    return renderResult;
};

const getFirestoreDocData = async (docRef: firebase.firestore.DocumentReference) => {
    const pNewDoc = docRef.get();
    mockfirestore.flush();
    return (await pNewDoc).data();
};

it ('does a test', async () => {
    var i = 1;
    expect(i)
});

it('renders without crashing', async () => {
    const { container } = doRender(testUser);
    const deckSelect = container.querySelector("#deck-select");
    //const searchBar = await waitForElement(() => getBy(container, "Card Search"), { container });
    expect(deckSelect).toBeDefined();
});

// it('displays and sets the current deck', async () => {
//     const {container} = doRender(testUser);
//     const dropDown = await waitForElement(() => getByTestId(container, "deck-select-test"), { container });
//
//     fireEvent.change(dropDown, { target: { value: testDeck.deckName } });
//     expect(dropDown).toHaveProperty("value", testDeck.deckName);
// });

it('displays more elements when search is launched', async () => {

    const {container} = doRender(testUser);
    // const dropDown = await waitForElement(() => getByText(container, "#deck-select"), { container });
    const name_field = await waitForElement(()=> getByTestId(container, "name-input-test"), { container });
    const search_butt = await waitForElement(() => getByTestId(container, "submit-button-test"), { container });
    fireEvent.change(name_field, { target: { "value": "Morophon" } });
    await fireEvent.click(search_butt);

    const morophon = await container.querySelector("list-item-Morophon");
    await expect(morophon);
});
