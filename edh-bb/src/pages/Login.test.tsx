import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByText, fireEvent, RenderResult } from '@testing-library/react'
import Login from './Login';

jest.mock('firebase/app');
// firebaseui requries more stubs than firebase-mock provides
const mockauth = new firebasemock.MockAuthentication();
mockauth.app = { options: {}, delete: async () => { } } as any;
firebase.auth = new firebasemock.MockFirebaseSdk(null, () => mockauth).auth;
firebase.auth.PhoneAuthProvider = {} as any;
(firebase.initializeApp as unknown as jest.MockedFunction<typeof firebase.initializeApp>).mockReturnValue(firebase as any);

const doRender = async () => {
  // kinda hacky way to wait to call `flush()` at the right time
  const renderResult = await new Promise<RenderResult>((resolve) => {
    const renderResult = render(<Login testAuthUiCallback_={() => resolve(renderResult)} />)
  });
  mockauth.flush();
  return renderResult;
};

it('renders without crashing', async () => {
  const { container } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });

  expect(signin_button).toBeDefined();
})

it('signs the user in', async () => {
  const { container } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });

  fireEvent.click(signin_button);
  mockauth.flush();

  expect(firebase.auth().currentUser).toBeTruthy();
})

it('redirects after signing in', async () => {
  const { container } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });

  fireEvent.click(signin_button);
  mockauth.flush();

  expect(window.location.pathname).toBe('/');
})
