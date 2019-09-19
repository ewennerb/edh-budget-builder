import React from 'react';
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
