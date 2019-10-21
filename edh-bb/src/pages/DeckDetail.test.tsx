import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText, fireEvent, findByText, getByTestId } from '@testing-library/react'
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

const testCardDeleteData: DeckData = {
  deck: ["card 2"],
  deckDescription: "desc",
  deckName: "name",
  ownerID: "abc",
}
const testBigDeckEnergy: DeckData = {
  deck: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
    "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
    "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
    "51", "52", "53", "54", "55", "56", "57", "58", "59", "60",
    "61", "62", "63", "64", "65", "66", "67", "68", "69", "70",
    "71", "72", "73", "74", "75", "76", "77", "78", "79", "80",
    "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", 
    "91", "92", "93", "94", "95", "96", "97", "98", "99", "100"],
  deckDescription: "big desc",
  deckName: "big name",
  ownerID: "abc",
}

const doRender = (deckId: string) => {
  const renderResult = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={["/deck-detail/" + deckId]}>
        <Route path="/deck-detail/:id" component={DeckDetail} />
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

it('rejects an invalid deck in EDH format', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  await waitForElement(() => getByLabelText(container, /Deck Name/), { container });

  expect(getByTestId(container, "illegal")).toBeDefined();
})

it('accepts a valid deck in EDH format', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testBigDeckEnergy);
  const { container } = doRender(testDeckId);
  await waitForElement(() => getByLabelText(container, /Deck Name/), { container });

  expect(getByTestId(container, "legal")).toBeDefined();
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

it('rejects an empty deck name', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckName_textinput = await waitForElement(() => getByLabelText(container, /Deck Name/), { container });
  const save_button = getByText(container, "Save Changes");

  fireEvent.change(deckName_textinput, { target: { value: '' } });
  fireEvent.click(save_button);

  const userDocRef = firebase.firestore().collection('deck').doc(testDeckId);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual(testDeckData);
})

it('rejects a deck name that is only spaces', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckName_textinput = await waitForElement(() => getByLabelText(container, /Deck Name/), { container });
  const save_button = getByText(container, "Save Changes");

  fireEvent.change(deckName_textinput, { target: { value: '   ' } });
  fireEvent.click(save_button);

  const userDocRef = firebase.firestore().collection('deck').doc(testDeckId);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual(testDeckData);
})

it('rejects a deck name that is too long', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deckName_textinput = await waitForElement(() => getByLabelText(container, /Deck Name/), { container });
  const save_button = getByText(container, "Save Changes");

  fireEvent.change(deckName_textinput, { target: { value: 'a'.repeat(101) } });
  fireEvent.click(save_button);

  const userDocRef = firebase.firestore().collection('deck').doc(testDeckId);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual(testDeckData);
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

it("creates a copy", async() => {
  firebase.firestore().collection('deck').doc(testDeckId);
  const { container } = doRender(testDeckId);
  const copyButton = await waitForElement(() => getByLabelText(container, "make a copy"), { container });

  await fireEvent.click(copyButton);
  mockfirestore.autoFlush(0);
  var deck = await firebase.firestore().collection("deck").get();

  deck.forEach(deckItem => {
    if(deckItem.id!=testDeckId){
      expect(deckItem.data()).toStrictEqual(update(testDeckData, { deckName: { $set: "name- copy"} }));
    }
  })
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

it("prompts users to confirm delete, clicking yes will delete deck", async() => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { getByText, container } = doRender(testDeckId);
  
  const deleteButton = await waitForElement(() => getByLabelText(container, "delete"), { container });
  await fireEvent.click(deleteButton);

  const confirmButton =await waitForElement(() => getByText("Yes"), { container });
  fireEvent.click(confirmButton);

  mockfirestore.flush();

  expect( firebase.firestore().collection('deck').doc(testDeckId).data).toEqual(null);
})

/* it('deletes a card from the deck', async () => {
  firebase.firestore().collection('deck').doc(testDeckId).set(testDeckData);
  const { container } = doRender(testDeckId);
  const deleteCard1Button = await waitForElement(() => getByTestId(container, '0'), { container });

  fireEvent.click(deleteCard1Button);
  
  const userDocRef = firebase.firestore().collection('deck').doc(testDeckId);
  
  expect(await getFirestoreDocData(userDocRef)).toEqual(testCardDeleteData);
}) */
