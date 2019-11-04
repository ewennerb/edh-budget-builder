import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText, } from '@testing-library/react'
import { SnackbarProvider } from 'notistack';
import PublicDeckDetail from './PublicDeckDetail';
import { Route, MemoryRouter } from 'react-router';
import { DeckData } from '../common';

jest.mock('file-saver')

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
      <MemoryRouter initialEntries={["/public-deck/" + deckId]}>
        <Route path="/public-deck/:id" component={PublicDeckDetail} />
      </MemoryRouter>
    </SnackbarProvider>
  );
  mockfirestore.flush();
  return renderResult;
}

it('shows the deck name', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckName = await waitForElement(() => getByText(container, testDeckData.deckName), { container });

  expect(deckName).toHaveProperty("textContent", testDeckData.deckName);
})

it('shows the cards', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  await waitForElement(() => getByText(container, testDeckData.deckName), { container });

  expect(getByText(container, "card 1")).toBeDefined()
  expect(getByText(container, "card 2")).toBeDefined()
})

it('shows the deck description', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  await waitForElement(() => getByText(container, testDeckData.deckName), { container });

  expect(getByText(container, testDeckData.deckDescription)).toHaveProperty("textContent", testDeckData.deckDescription);
})
