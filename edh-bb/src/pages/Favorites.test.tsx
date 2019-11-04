import React, { ReactComponentElement } from 'react';
import Favorites from './Favorites';
import CardSearch, { addToFavorites } from './CardSearch';
import firebase from 'firebase/app';
import { render, waitForElement, getByLabelText, getByText, fireEvent, getByTestId } from '@testing-library/react'
import firebasemock from 'firebase-mock';
import { SnackbarProvider } from 'notistack';
import { all, async } from 'q';

jest.mock('firebase/app');
const mockfirestore = new firebasemock.MockFirestore();
mockfirestore.autoFlush(0)
firebase.firestore = (() => mockfirestore) as any;

const testFavoriteCards: Array<string> = [
    "Dragon1",
    "Dragon2"
]

const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;

const doRender = (user: firebase.User) => {
    const renderResult = render(<SnackbarProvider><Favorites user={user} /></SnackbarProvider>);
    mockfirestore.flush();
    return renderResult;
}

const getFirestoreDocData = async (docRef: firebase.firestore.DocumentReference) => {
  const pNewDoc = docRef.get();
  mockfirestore.flush();
  return (await pNewDoc).data();
}

it("confirms length of test favorite cards list", () => {
    expect(testFavoriteCards.length).toEqual(2);
})

it("shouldn't have favorites field", async () => {
    var favorites;
    firebase.firestore().collection('users').doc(testUser.uid).get().then(function (doc) {
        let favoritesDoc = doc.get("favorites");
        favorites = favoritesDoc;
    })
    expect(favorites).toBeUndefined();
})

it("should have a favorites field", async () => {
    doRender(testUser);
    var favorites;
    const userRef = firebase.firestore().collection("users").doc(testUser.uid);
    userRef.update({
        favorites: testFavoriteCards
    });
    await userRef.get().then(function (doc) {
        let favoritesDoc = doc.get("favorites");
        favorites = favoritesDoc;
    });
    expect(favorites).toBeDefined;
})

it("should have a favorites field with correct number of cards", async () => {
    doRender(testUser);
    var favorites: Array<string> = [];
    const userRef = firebase.firestore().collection("users").doc(testUser.uid);
    userRef.update({
        favorites: testFavoriteCards
    });
    await userRef.get().then(function (doc) {
        let favoritesDoc: Array<string> = doc.get("favorites");
        favorites = favoritesDoc;
        console.log(favorites.length);
    });
    console.log(favorites.length);
    expect(favorites.length).toEqual(2);
})

it("should have a favorites field with correct number or cards and correct card names", async () => {
    doRender(testUser);
    var favorites: Array<string> = [];
    const userRef = firebase.firestore().collection("users").doc(testUser.uid);
    userRef.update({
        favorites: testFavoriteCards
    });
    await userRef.get().then(function (doc) {
        let favoritesDoc: Array<string> = doc.get("favorites");
        favorites = favoritesDoc;
    });
    expect(favorites).toStrictEqual(testFavoriteCards);
})
