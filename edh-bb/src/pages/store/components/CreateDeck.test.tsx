import React from 'react';
import firebase from 'firebase/app';
//firebase mock?
import CreateDeck from './CreateDeck';
import PostDeck from './CreateDeck';


var deck: PostDeck = new PostDeck(null);

test('Title that is too long (101 chars)', () => {
    const longTitle: string = 'aqUIWAphrvG06Yo42a9gF2mWVY3u2V9DHWa70NmPBiOAqeEK93s79iE39P9JoFTF8Br1YkzdW4R7pRBOE1aVRE0ilSQwcfne0Lt2L';
    var validDeck: boolean = deck.isValidTitle(longTitle);
    expect(validDeck).toBeFalsy();
});

test('Title is valid (100 chars exactly)', () => {
    const exactTitleLength: string = 'aqUIWAphrvG06Yo42a9gF2mWVY3u2V9DHWa70NmPBiOAqeEK93s79iE39P9JoFTF8Br1YkzdW4R7pRBOE1aVRE0ilSQwcfne0LtL'
    var validDeck: boolean = deck.isValidTitle(exactTitleLength);
    expect(validDeck).toBeTruthy();
});

test('Title is only spaces (invalid)', () => {
    const emptySpaceTitle: string = '     ';
    var validDeck: boolean = deck.isValidTitle(emptySpaceTitle);
    expect(validDeck).toBeFalsy();
});

test('Title is nearly invalid, but is indeed valid', () => {
    const almostEmptySpaceTitle: string = ' '.repeat(99) + 'a';
    var validDeck: boolean = deck.isValidTitle(almostEmptySpaceTitle);
    expect(almostEmptySpaceTitle).toBeTruthy();
});