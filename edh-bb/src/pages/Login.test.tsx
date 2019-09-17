import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByText, fireEvent, RenderResult } from '@testing-library/react'
import Login from './Login';

jest.mock('firebase/app');
const mockauth = new firebasemock.MockAuthentication();
mockauth.autoFlush(0);
// firebaseui requries more stubs than firebase-mock provides
mockauth.app = { options: {}, delete: async () => { } } as any;
const realSignInWithPopup = mockauth.signInWithPopup.bind(mockauth); // this one's just the wrong type altogether
const getMockAdditionalUserInfo = jest.fn<firebase.auth.AdditionalUserInfo, []>().mockReturnValue({ isNewUser: false } as any);
mockauth.signInWithPopup = jest.fn(provider => (
  realSignInWithPopup(provider)
    .then((user: any) => ({
      user,
      credential: {},
      additionalUserInfo: getMockAdditionalUserInfo(),
    }))
));
mockauth.updateCurrentUser = (newUser: any) => {
  mockauth.currentUser = newUser;
  return Promise.resolve();
};
firebase.auth = new firebasemock.MockFirebaseSdk(null, () => mockauth).auth;
firebase.auth.PhoneAuthProvider = {} as any;
(firebase.initializeApp as unknown as jest.MockedFunction<typeof firebase.initializeApp>).mockReturnValue(firebase as any);

beforeEach(() => {
  mockauth.currentUser = null;
})

const doRender = () => (
  new Promise<{ renderResult: RenderResult, redirectPromise: Promise<string> }>(resolveRender => {
    const redirectPromise = new Promise<string>(resolveRedirect => {
      const renderResult = render(
        <Login authUiCallback={() => resolveRender({ renderResult, redirectPromise })} doRedirect={resolveRedirect} />
      );
    })
  })
);

it('renders without crashing', async () => {
  const { renderResult: { container } } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });

  expect(signin_button).toBeDefined();
})

it('signs the user in', async () => {
  const { renderResult: { container }, redirectPromise } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });

  const authStateChangedPromise = new Promise(resolve => firebase.auth().onAuthStateChanged(resolve));
  fireEvent.click(signin_button);

  expect(await authStateChangedPromise).toBeTruthy();
  await redirectPromise; // required to keep auth module in a consistent state for subsequent tests
})

it('redirects after signing in', async () => {
  const { renderResult: { container }, redirectPromise } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });

  fireEvent.click(signin_button);

  expect(await redirectPromise).toBe('/');
})

it('redirects after signing in a new user', async () => {
  const { renderResult: { container }, redirectPromise } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });

  getMockAdditionalUserInfo.mockReturnValueOnce({ isNewUser: true } as any);
  fireEvent.click(signin_button);

  expect(await redirectPromise).toBe('/change-username');
})
