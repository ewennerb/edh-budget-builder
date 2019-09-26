import React from 'react';
import CreateDeck from './CreateDeck';
import firebase, { FirebaseError } from 'firebase/app';
import { render, waitForElement, getByText, fireEvent, RenderResult } from '@testing-library/react'



it("renders", () => {
  jest.mock('firebase/app');
  
  const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;
  var createDeckObj = new CreateDeck({user: testUser});
  var rendered = createDeckObj.render()
  
  expect(rendered).toMatchSnapshot();
})

// fireEvent(
//   getByText(container, 'Submit'),
//   new MouseEvent('click', {
//    
//   })
// )
