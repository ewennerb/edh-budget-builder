import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByLabelText, getByText } from '@testing-library/react'
import ChangeUsername from './ChangeUsername';

jest.mock('firebase/app');
const mockauth = new firebasemock.MockAuthentication();
firebase.auth = (() => mockauth) as any;
const mockfirestore = new firebasemock.MockFirestore();
firebase.firestore = (() => mockfirestore) as any;

it('renders without crashing', async () => {
  const { container } = render(
    <ChangeUsername user={{ uid: "testUidAbc123" } as any} />
  );
  mockfirestore.flush();
  const username_edittext = await waitForElement(() => getByLabelText(container, "Username"), { container });
  const submit_button = getByText(container, "Submit");
  expect(username_edittext).toBeDefined
  expect(submit_button).toBeDefined
})
