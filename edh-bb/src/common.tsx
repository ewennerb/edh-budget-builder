import React from "react";

// There is no default value for a `firebase.User`, so instead we force null into the context, subverting the type system
// Anything that needs an `AuthContext` **must not be rendered** if the user is not logged in.
export const AuthContext = React.createContext(null as unknown as firebase.User);

export interface DeckData {
  deckName: string;
  deckDescription: string;
  deck: string[];
  ownerID: string;
}

/// returns an error message, or null if its valid
export const validateDeckName = (newDeckName: string) => {
    if (newDeckName.length > 100)
      return "Deck name must be 100 characters or fewer";
    if (newDeckName.trim().length === 0)
      return "Deck name must contain at least 1 non-whitespace character";
    return null;
}
