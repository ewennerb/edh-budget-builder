import React from 'react';
import CreateDeck from './CreateDeck';
import firebase from 'firebase/app';
import {render,fireEvent} from '@testing-library/react'
import firebasemock from 'firebase-mock';

jest.mock('firebase/app');
const mockfirestore = new firebasemock.MockFirestore();
mockfirestore.autoFlush(0)
firebase.firestore = (() => mockfirestore) as any;

it("renders", () => {
  
  const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;
  var createDeckObj = new CreateDeck({user: testUser});
  var rendered = createDeckObj.render();
  
  expect(rendered).toMatchSnapshot();
})


it("changes text input", async() => {
 
  


  const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;


  const { getByRole, getByTestId, getByLabelText,container} =  await render(<CreateDeck user={testUser} />);
 
  const deckName =await container.querySelector("#deckName") as HTMLInputElement;
  const deckDesc =await container.querySelector("#deckDescription") as HTMLInputElement;
  const submit = await getByTestId("submit")
  if(deckName==null){
    console.log("null")
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


  const { getByRole, getByTestId, getByLabelText,container} =  await render(<CreateDeck user={testUser} />);
 
  const deckName =await container.querySelector("#deckName");
  const deckDesc =await container.querySelector("#deckDescription");
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

