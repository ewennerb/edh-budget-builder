import React from 'react';
import CreateDeck from './CreateDeck';
import firebase, { FirebaseError } from 'firebase/app';
import {render, waitForElement, getByLabelText, getByTestId, fireEvent, RenderResult } from '@testing-library/react'
import {Firestore} from './FirebaseMock';
import firebasemock from 'firebase-mock';



// it("renders", () => {
//   jest.mock('firebase/app');
  
//   const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;
//   var createDeckObj = new CreateDeck({user: testUser});
//   var rendered = createDeckObj.render();
  
//   expect(rendered).toMatchSnapshot();
// })

// jest.mock('firebase/app');

// const mockfirestore = new firebasemock.MockFirestore();
// firebase.firestore = (() => mockfirestore) as any;




it("addDeckToDatabase", async() => {
 
  
  jest.mock('firebase/app');
  const mockfirestore = new firebasemock.MockFirestore();
  mockfirestore.autoFlush(0)
  firebase.firestore = (() => mockfirestore) as any;

  const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;


  const { getByRole, getByTestId, getByLabelText,container} =  await render(<CreateDeck user={testUser} />);
 
  const deckName =await container.querySelector("#deckName");
  const deckDesc =await container.querySelector("#deckDescription");
  const submit = await getByTestId("submit")
  if(deckName==null){
    console.log("null")
    expect("false").toBeTruthy
  }
  //console.log(deckName)
  // fireEvent.input(deckName,"testName")
  var event = new Event('change');

  // await fireEvent.keyDown(deckName, { target: { "value": "testName" } });
  // await expect(deckName.value).toBe('testName');
  // await fireEvent.change(deckDesc, { target: { "value": "testDesc" } });
  // await expect(deckDesc.value).toBe('testDesc');

  // const submit_button = await waitForElement(() => getByRole("form"));

  await fireEvent.submit(submit, { target: { "deckName": "testName","deckDescription": "testDesc" } });


  var deck = await firebase.firestore().collection('deck').get();




    deck.forEach(deckItem => {
      
      expect(deckItem.data().ownerID).toStrictEqual("testUidAbc123");
      
    })
    

  
})



// fireEvent(
//   getByText(container, 'Submit'),
//   new MouseEvent('click', {
//    
//   })
// )
