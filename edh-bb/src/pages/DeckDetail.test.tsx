

import {deleteDeck} from './DeckDetail';
import firebase from 'firebase/app';

import firebasemock from 'firebase-mock';




jest.mock('firebase/app');
const mockfirestore = new firebasemock.MockFirestore();
mockfirestore.autoFlush(0)
firebase.firestore = (() => mockfirestore) as any;



it("Deletes Deck function deletes deck", async() => {


  var deckID = "";
  await firebase.firestore().collection('deck').add({

    deckName: "testName",
    deckDescription: "testDescription",
    deck: [],
    ownerID: "testUidAbc123"

  })
    .then(function (deckRef) {
      deckID = deckRef.id;
    })

    var deck = await firebase.firestore().collection('deck').get();
    expect(deck.empty).toBeFalsy();



  
  deleteDeck(deckID);

  var deck = await firebase.firestore().collection('deck').get();

  expect(deck.empty).toBeTruthy()

})
