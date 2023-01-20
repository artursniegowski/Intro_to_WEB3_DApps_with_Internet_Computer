import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import homeImage from "../../assets/home-img.png";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { opentmarketplace_05_backend } from "../../../declarations/opentmarketplace_05_backend";
import CURRENT_USER_ID from "../index";

function Header() {

  // creating a state for the users Gallery
  const [userOwnedGallery, setUserOwnedGallery] = useState();
  const [listingGallery, setListingGallery] = useState();


  async function getNFTs() {
    // CURRENT_USER_ID - this is a principal id created in the index.jsx
    // which is the anonymous user - this is just for testing
    // TODO: adjust the principal id to the real user.
    const userNFTIds = await opentmarketplace_05_backend.getOwnedNFTs(CURRENT_USER_ID);
    
    // setting the galery
    setUserOwnedGallery(<Gallery title="my NFTs" nftIds={userNFTIds} role="collection" />);

    // getting the principals - ids - if the listed nfts
    const listedNftIds = await opentmarketplace_05_backend.getListedNFTs();
    // setting the listing gallery
    setListingGallery(<Gallery title="Discover" nftIds={listedNftIds} role="discover" />);
  };

  // to call the function getNFTs only the first time
  // when this view gets render
  useEffect(() => {
    getNFTs();
  }, []);

  return (
    <BrowserRouter>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <Link to="/" >
              <h5 className="Typography-root header-logo-text">openT Marketplace</h5>
            </Link>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover" reloadDocument>Discover</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            {/* You can use <Link reloadDocument> to skip client side routing and let the browser handle the transition normally (as if it were an <a href>). */}
              <Link to="/minter" reloadDocument>Minter</Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection" reloadDocument>My NFTs</Link>
            </button>
          </div>
        </header>
      </div>
      <Routes>
        <Route exact path="/" element={<img className="bottom-space" src={homeImage} />} /> 
        <Route path="/discover" element={listingGallery} />
        <Route path="/minter" element={<Minter />} />
        <Route path="/collection" element={userOwnedGallery} />
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
