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
  apiKey: "AIzaSyA6H66HBAX22VmGjTROsoldm-QEUYLww0c",
  authDomain: "edh-budget-builder.firebaseapp.com",
  databaseURL: "https://edh-budget-builder.firebaseio.com",
  projectId: "edh-budget-builder",
  storageBucket: "",
  messagingSenderId: "262938138815",
  appId: "1:262938138815:web:d78522e2f346c342f30e0a"
};
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged((user) =>
  ReactDOM.render(
    <SnackbarProvider>
      <BrowserRouter>
        <App user={user} />
      </BrowserRouter>
    </SnackbarProvider>,
    document.getElementById('root')
  )
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default firebase