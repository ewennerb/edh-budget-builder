import React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import PostDeck from "./store/components/CreateDeck"





interface deckInfo {
  deckName: string;
  deckDescription: string;
  cards: string;
}


const CreateDeck: React.FC = () => {
  // TODO

  const deck : deckInfo = {
    deckName: "test123",
    deckDescription: "test",
    cards: "test"
  };

  const deckPostInstance = new PostDeck(deck); 
  const result = deckPostInstance.render(); 
return(result);
}

export default CreateDeck;
