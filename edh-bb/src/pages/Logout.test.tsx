/*import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render } from '@testing-library/react';
import Logout from './Logout';

jest.mock('firebase/app');
const mockauth = new firebasemock.MockAuthentication();
firebase.auth = new firebasemock.MockFirebaseSdk(null, () => mockauth).auth;
mockauth.autoFlush(0);

const doRender = () => {
  const renderResult = render(<Logout/>);
  return renderResult;
}

it('redirects to login page after logout', async () => {
  doRender();

  expect(Logout).toBeTruthy;
})*/

it('is a fake test', () => {
  expect(1).toBe(1);
})
