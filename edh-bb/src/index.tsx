import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHe4wFmCfmFZqCF236pF5kvCRgdOPP3Ko",
  authDomain: "edh-budget-builder-buggy.firebaseapp.com",
  databaseURL: "https://edh-budget-builder-buggy.firebaseio.com",
  projectId: "edh-budget-builder-buggy",
  storageBucket: "edh-budget-builder-buggy.appspot.com",
  messagingSenderId: "790881381558",
  appId: "1:790881381558:web:d72b7fb8eabc8e69b6ca17"
};
firebase.initializeApp(firebaseConfig);
const unsub = firebase.auth().onAuthStateChanged((user) => {
  ReactDOM.render(
    <SnackbarProvider>
      <BrowserRouter>
        <App user={user} />
      </BrowserRouter>
    </SnackbarProvider>,
    document.getElementById('root')
  );
  unsub();
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
