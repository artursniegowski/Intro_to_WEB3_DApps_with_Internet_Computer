import React from "react";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import { Principal } from "@dfinity/principal";


// this is the anonymous user principle id
// created jsut for testing
// TODO: not suitable for production, for deployment this would be replaced by the authenticated user
const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
