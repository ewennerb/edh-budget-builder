import React from 'react';
import firebase from 'firebase/app';
import firebasemock from 'firebase-mock';
import { render, waitForElement, getByText, fireEvent, RenderResult } from '@testing-library/react';
import Logout from './Logout';