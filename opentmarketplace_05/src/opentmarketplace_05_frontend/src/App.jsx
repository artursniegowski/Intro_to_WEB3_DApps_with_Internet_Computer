import React from "react";
import './App.css';
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from "./components/Item";
import Minter from "./components/Minter";

function App() {

  // const NFTID = "rrkah-fqaaa-aaaaa-aaaaq-cai";

  return (
    <div className="App">
      <Header />
      {/* <Minter /> */}
      {/* <Item canisterID={NFTID}/> */}
      <Footer />
    </div>
  );
}

export default App;
