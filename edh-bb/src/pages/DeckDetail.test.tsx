import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText, fireEvent, findByText } from '@testing-library/react'
import { SnackbarProvider } from 'notistack';
import DeckDetail from './DeckDetail';
import { Route, MemoryRouter } from 'react-router';
import { DeckData } from '../common';
import update from 'immutability-helper';
import FileSaver from 'file-saver';
import ReactDOM from 'react-dom';

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

mockfirestore.autoFlush(0);

const doRender = (deckId: string) => {

  const renderResult = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={["/deck-detail/" + deckId]}>
        <Route path="/deck-detail/:id" component={DeckDetail} />
      </MemoryRouter>
    </SnackbarProvider>
  );
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

it('downloads the deck', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const download_button = await waitForElement(() => getByLabelText(container, "download"), { container });

  fireEvent.click(download_button);

  expect(FileSaver.saveAs).toHaveBeenCalled();
  // seems like `FileReader` is the only way to extract the contents of a `Blob`
  const fr = new FileReader();
  const pBlobContents = new Promise(resolve => {
    fr.addEventListener('load', function () { resolve(this.result) })
    fr.readAsText((FileSaver.saveAs as jest.Mock).mock.calls[0][0])
  });
  expect(await pBlobContents).toBe(JSON.stringify(testDeckData));
})

it("prompts users to confirm delete, canceling will not delete deck", async() => {

    firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
    const { getByText, container } = doRender(testDeckId);
    const deleteButton = await waitForElement(() => getByLabelText(container, "delete"), { container });

  
    await fireEvent.click(deleteButton);

    const cancelButton =await waitForElement(() => getByText("No"), { container });

    fireEvent.click(cancelButton);

    expect( firebase.firestore().collection('deck').doc(testDeckId).data).toEqual(testDeckData);
})

it("creates a copy", async() => {

    firebase.firestore().collection('deck').doc(testDeckId);
    const { container } = doRender(testDeckId);
    const copyButton = await waitForElement(() => getByLabelText(container, "make a copy"), { container });


    await fireEvent.click(copyButton);

    var deck = await firebase.firestore().collection("deck").get();
  

    deck.forEach(deckItem => {
      if(deckItem.id!=testDeckId){
        expect(deckItem.data()).toStrictEqual(update(testDeckData, { deckName: { $set: "name- copy"} }));
      }
      
    })

})