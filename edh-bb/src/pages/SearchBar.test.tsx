import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText, fireEvent, getByPlaceholderText } from '@testing-library/react'
import SearchBar from './SearchBar';
import { SnackbarProvider } from 'notistack';

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
    const renderResult = render(<SnackbarProvider><SearchBar searchQuery/></SnackbarProvider>);
    mockfirestore.flush();
    return renderResult;
}

const getFirestoreDocData = async (docRef: firebase.firestore.DocumentReference) => {
    const pNewDoc = docRef.get();
    mockfirestore.flush();
    return (await pNewDoc).data();
}

it('renders without crashing', async () => {
    const { container } = doRender(testUser);
    const nameQuery = await waitForElement(() => getByPlaceholderText (container, "Search by Card Name"), { container });
    const searchButt = getByText(container, "Search");

    expect(nameQuery).toBeDefined();
    expect(searchButt).toBeDefined();
})
