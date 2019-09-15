import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText, fireEvent } from '@testing-library/react'
import ChangeUsername from './ChangeUsername';
import { SnackbarProvider } from 'notistack';

jest.mock('firebase/app');
const mockfirestore = new firebasemock.MockFirestore();
firebase.firestore = (() => mockfirestore) as any;

const testUser: firebase.User = { uid: "testUidAbc123" } as any;
const doRender = (user: firebase.User) => {
  const renderResult = render(<SnackbarProvider><ChangeUsername user={user} /></SnackbarProvider>);
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
  const username_textinput = await waitForElement(() => getByLabelText(container, "Username"), { container });
  const submit_button = getByText(container, "Submit");

  expect(username_textinput).toBeDefined
  expect(submit_button).toBeDefined
})

it('sets the username when empty', async () => {
  const { container } = doRender(testUser);
  const username_textinput = await waitForElement(() => getByLabelText(container, "Username"), { container });
  const submit_button = getByText(container, "Submit");

  const newUsername = "bob93";
  fireEvent.change(username_textinput, { target: { value: newUsername } });
  fireEvent.click(submit_button);

  const userDocRef = firebase.firestore().collection("users").doc(testUser.uid);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual({ username: newUsername });
})

it('is pre-filled with the current username', async () => {
  const testUsername = "test_username123";
  firebase.firestore().collection("users").doc(testUser.uid).set({ username: testUsername });
  const { container } = doRender(testUser);
  const username_textinput = await waitForElement(() => getByLabelText(container, "Username"), { container });

  expect(username_textinput).toHaveProperty("value", testUsername);
})

it('rejects an empty username', async () => {
  const testUsername = "test_username123";
  firebase.firestore().collection("users").doc(testUser.uid).set({ username: testUsername });
  const { container } = doRender(testUser);
  const username_textinput = await waitForElement(() => getByLabelText(container, "Username"), { container });
  const submit_button = getByText(container, "Submit");

  fireEvent.change(username_textinput, { target: { value: '' } });
  fireEvent.click(submit_button);

  const userDocRef = firebase.firestore().collection("users").doc(testUser.uid);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual({ username: testUsername });
})

it('rejects a username with invalid characters', async () => {
  const testUsername = "test_username123";
  firebase.firestore().collection("users").doc(testUser.uid).set({ username: testUsername });
  const { container } = doRender(testUser);
  const username_textinput = await waitForElement(() => getByLabelText(container, "Username"), { container });
  const submit_button = getByText(container, "Submit");

  fireEvent.change(username_textinput, { target: { value: '%' } });
  fireEvent.click(submit_button);

  const userDocRef = firebase.firestore().collection("users").doc(testUser.uid);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual({ username: testUsername });
})

it('rejects a username that is too long', async () => {
  const testUsername = "test_username123";
  firebase.firestore().collection("users").doc(testUser.uid).set({ username: testUsername });
  const { container } = doRender(testUser);
  const username_textinput = await waitForElement(() => getByLabelText(container, "Username"), { container });
  const submit_button = getByText(container, "Submit");

  fireEvent.change(username_textinput, { target: { value: 'a'.repeat(101) } });
  fireEvent.click(submit_button);

  const userDocRef = firebase.firestore().collection("users").doc(testUser.uid);
  expect(await getFirestoreDocData(userDocRef)).toStrictEqual({ username: testUsername });
})
