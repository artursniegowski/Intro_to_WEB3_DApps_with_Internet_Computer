import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthClient } from "@dfinity/auth-client";

const root = ReactDOM.createRoot(document.getElementById('root'));

// for creating the authentication user
const authClient = await AuthClient.create();

// ############### AUTHENTICATION ##########################
//⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
// coomment it out if you dont need it


// // fot testing !
// if (! await authClient.isAuthenticated()) {
// // if (await authClient.isAuthenticated()) {
//   handleAuthenticated(authClient);
// } else {
//   // creating the authorization with Internet Computer
//   await authClient.login({
//     identityProvider: "https://identity.ic0.app/#authorize",
//     onSuccess: () => {
//       handleAuthenticated(authClient);
//     }
//   });
// }

// async function handleAuthenticated (authClient) {
//   root.render(
//     <React.StrictMode>
//           <App currentIdPrincipal={String(authClient._identity.getPrincipal())}/>
//     </React.StrictMode>
//   );
// to log out the identity
// console.log(authClient.getIdentity());
// };

// ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️
// ############### AUTHENTICATION ##########################


// uncomment this if you dont want the authentication
// and comment the authentication part
root.render(
  <React.StrictMode>
    <App currentIdPrincipal={String(authClient._identity.getPrincipal())}/>
  </React.StrictMode>
);
