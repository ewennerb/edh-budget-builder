import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByText, fireEvent, RenderResult } from '@testing-library/react';
import Login from './Login';

jest.mock('firebase/app');
const mockauth = new firebasemock.MockAuthentication();
mockauth.autoFlush(0);

mockauth.app = { options: {}, delete: async () => { } } as any;
const realSignInWithPopup = mockauth.signInWithPopup.bind(mockauth);
const getMockAdditionalUserInfo = jest.fn<firebase.auth.AdditionalUserInfo, []>().mockReturnValue({ isNewUser: false } as any);
mockauth.signInWithPopup = jest.fn(provider => (
  realSignInWithPopup(provider)
    .then((user: any) => ({
      user,
      credential: {},
      additionalUserInfo: getMockAdditionalUserInfo(),
    }))
));

firebase.auth = new firebasemock.MockFirebaseSdk(null, () => mockauth).auth;
firebase.auth.PhoneAuthProvider = {} as any;
(firebase.initializeApp as unknown as jest.MockedFunction<typeof firebase.initializeApp>).mockReturnValue(firebase as any);

const doRender = () => (
  new Promise<{ renderResult: RenderResult, redirectPromise: Promise<string> }>(resolveRender => {
    const redirectPromise = new Promise<string>(resolveRedirect => {
      const renderResult = render(
        <Login authUiCallback={() => resolveRender({ renderResult, redirectPromise })} doRedirect={resolveRedirect} />
      );
    })
  })
);


it('redirects to login page after logout', async () => {
  //Login the user
  const { renderResult: { container }, redirectPromise } = await doRender();
  const signin_button = await waitForElement(() => getByText(container, "Sign in with Google"), { container });
  fireEvent.click(signin_button);

  //Log out the user
  const logout_button = await waitForElement(() => getByText(container, "LOG OUT"), {container});
  fireEvent.click(logout_button);

  expect(await redirectPromise).toBe('/login');
})
