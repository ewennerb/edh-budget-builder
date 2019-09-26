import React, { ReactComponentElement } from 'react';
import firebase from 'firebase/app';
import CreateDeck from './CreateDeck';
import { isValidTitle } from './CreateDeck';

test('A valid title is submitted', () => {
    const validDeck: string = 'A very valid title';
    expect(isValidTitle(validDeck)).toBeTruthy;
});

test('An invalid title is rejected (only spaces', () => {
    expect(isValidTitle('     ')).toBeFalsy;
});

test('An invalid title (101 chars)', () => {
    expect(isValidTitle('a'.repeat(101))).toBeFalsy;
});

test('A nearly invalid title passes (99 spaces and one char)', () => {
    expect(isValidTitle((' '.repeat(99)) + 'f')).toBeTruthy;
});