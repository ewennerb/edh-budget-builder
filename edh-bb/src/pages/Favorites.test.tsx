import React, { ReactComponentElement } from 'react';
import Favorites from './Favorites';
import CardSearch, { addToFavorites } from './CardSearch';
import firebase from 'firebase/app';
import { render, fireEvent } from '@testing-library/react'
import firebasemock from 'firebase-mock';
import { SnackbarProvider } from 'notistack';
import { all } from 'q';

jest.mock('firebase/app');
const mockfirestore = new firebasemock.MockFirestore();
mockfirestore.autoFlush(0)
firebase.firestore = (() => mockfirestore) as any;

const testFavoriteCards: Array<string> = {
  0: "Dragon",
  1: "Dragon2"
}

const testUser: firebase.User = { uid: "testUidAbc123" } as firebase.User;

const getFirestoreDocData = async (docRef: firebase.firestore.DocumentReference) => {
  const pNewDoc = docRef.get();
  mockfirestore.flush();
  return (await pNewDoc).data();
}

it("Should have a favorite cards field with 2 cards in it", () => {
  firebase.firestore().collection('users').doc(testUser.uid).set({ favorites: testFavoriteCards });
  //console.log(firebase.firestore().collection('users').doc(testUser.uid));
  let testing = firebase.firestore().collection('users').doc(testUser.uid);
  console.log(testing);
})

it("Should not have a field defined for favorite cards", () => {
  firebase.firestore().collection("users").doc(testUser.uid).get().then(doc => {
    if (doc.exists) {
      console.log("here bob");
      let favoriteCards = doc.get("favorites");
      expect(favoriteCards).toBeNaN;
    }
    else {
      console.log("noperoni");
    }
  });
})