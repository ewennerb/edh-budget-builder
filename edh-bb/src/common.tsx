import React from "react";

// There is no default value for a `firebase.User`, so instead we force null into the context, subverting the type system
// Anything that needs an `AuthContext` **must not be rendered** if the user is not logged in.
const AuthContext = React.createContext(null as unknown as firebase.User);

export { AuthContext };