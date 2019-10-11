import React from 'react';
import firebase, { firestore } from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText, fireEvent } from '@testing-library/react'
import { SnackbarProvider } from 'notistack';
import BetterDeckDetail from './BetterDeckDetail';
import { Route, MemoryRouter } from 'react-router';
import { DeckData } from '../common';
import update from 'immutability-helper';

jest.mock('firebase/app');
const mockfirestore = new firebasemock.MockFirestore();
firebase.firestore = (() => mockfirestore) as any;

const testDeckId = "123test123";
const testDeckData: DeckData = {
  deck: ["card 1", "card 2"],
  deckDescription: "desc",
  deckName: "name",
  ownerID: "abc",
}
const doRender = (deckId: string) => {
  const renderResult = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={["/deck-detail/" + deckId]}>
        <Route path="/deck-detail/:id" component={BetterDeckDetail} />
      </MemoryRouter>
    </SnackbarProvider>
  );
  mockfirestore.flush();
  return renderResult;
}

const getFirestoreDocData = async (docRef: firebase.firestore.DocumentReference) => {
  const pNewDoc = docRef.get();
  mockfirestore.flush();
  return (await pNewDoc).data();
}

it('renders without crashing', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const heading = await waitForElement(() => getByText(container, "Deck Detail"), { container });

  expect(heading).toBeDefined();
})

it('shows the deck name', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckName_textinput = await waitForElement(() => getByLabelText(container, /Deck Name/), { container });

  expect(deckName_textinput).toHaveProperty("value", testDeckData.deckName);
})

it('shows the cards', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  await waitForElement(() => getByText(container, "Deck Detail"), { container });

  expect(getByText(container, "card 1")).toBeDefined()
  expect(getByText(container, "card 2")).toBeDefined()
})

it('shows the deck description', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckDesc_textinput = await waitForElement(() => getByLabelText(container, /Deck Description/), { container });

  expect(deckDesc_textinput).toHaveProperty("value", testDeckData.deckDescription);
})

it('changes the deck name', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckName_textinput = await waitForElement(() => getByLabelText(container, /Deck Name/), { container });
  const save_button = getByText(container, "Save Changes");

  const newDeckName = "new deck name";
  fireEvent.change(deckName_textinput, { target: { value: newDeckName } });
  fireEvent.click(save_button);

  const userDocRef = firebase.firestore().collection('deck').doc(testDeckId);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual(update(testDeckData, { deckName: { $set: newDeckName } }));
})

it('changes the deck description', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckName_textinput = await waitForElement(() => getByLabelText(container, /Deck Description/), { container });
  const save_button = getByText(container, "Save Changes");

  const newDeckDesc = "new deck description";
  fireEvent.change(deckName_textinput, { target: { value: newDeckDesc } });
  fireEvent.click(save_button);

  const userDocRef = firebase.firestore().collection('deck').doc(testDeckId);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual(update(testDeckData, { deckDescription: { $set: newDeckDesc } }));
})
