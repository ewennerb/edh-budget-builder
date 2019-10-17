
import React, { ReactComponentElement } from 'react';
import CreateDeck, { isValidTitle }  from './CreateDeck';
import firebase from 'firebase/app';
import {render,fireEvent} from '@testing-library/react'
import firebasemock from 'firebase-mock';
import { SnackbarProvider } from 'notistack';


jest.mock('firebase/app');
const mockfirestore = new firebasemock.MockFirestore();
mockfirestore.autoFlush(0)
firebase.firestore = (() => mockfirestore) as any;


// it("renders", () => {
  
//   const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;
//   var createDeckObj = new CreateDeck({user: testUser});
//   var rendered = createDeckObj.render();
  
//   expect(rendered).toMatchSnapshot();
// })

 
it("changes text input", async() => {
  const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;
  const { getByRole, getByTestId, getByLabelText,container} =  await render(<SnackbarProvider><CreateDeck user={testUser} /></SnackbarProvider>);
 
  const deckName =await container.querySelector("#deckName") as HTMLInputElement;
  const deckDesc =await container.querySelector("#deckDescription") as HTMLInputElement;
  const submit = await getByTestId("submit")
  if(deckName==null){
    expect("false").toBeTruthy
  }
  var event = new Event('change');

  await fireEvent.keyDown(deckName, { target: { "value": "testName" } });
  await expect(deckName.value).toBe('testName');
  await fireEvent.change(deckDesc, { target: { "value": "testDesc" } });
  await expect(deckDesc.value).toBe('testDesc');
})

it("addDeckToDatabase", async() => { 
  
  const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;

  const { getByRole, getByTestId, getByLabelText,container} =  await render(<SnackbarProvider><CreateDeck user={testUser} /></SnackbarProvider>);

  const deckName =await container.querySelector("#deckName");
 
  const submit = await getByTestId("submit")
  if(deckName==null){
    console.log("null")
    expect("false").toBeTruthy
  }

  var event = new Event('change');

  await fireEvent.submit(submit, { target: { "deckName": "testName","deckDescription": "testDesc" } });


  var deck = await firebase.firestore().collection('deck').get();

    deck.forEach(deckItem => {
      
      expect(deckItem.data().ownerID).toStrictEqual("testUidAbc123");
      
    })
    
})

it("redirects to homepage", async()=>{
  const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;

  const {  getByTestId, container} =  await render(<SnackbarProvider><CreateDeck user={testUser} /></SnackbarProvider>);
  
  const submit = await getByTestId("submit")

  var event = new Event('change');

  await fireEvent.submit(submit, { target: { "deckName": "testName","deckDescription": "testDesc" } });

  expect(getByTestId('location-display').innerHTML).toBe("/deck-list");
});

test('A valid title is submitted', () => {
    const validDeck: string = 'A very valid title';
    expect(isValidTitle(validDeck)).toBeTruthy;
});

test('An invalid title is rejected (only spaces', () => {
    expect(isValidTitle('     ')).toBeFalsy;
});

test('An invalid title (101 chars)', () => {
    expect(isValidTitle('a'.repeat(101))).toBeFalsy;
});

test('A nearly invalid title passes (99 spaces and one char)', () => {
    expect(isValidTitle((' '.repeat(99)) + 'f')).toBeTruthy;
});

