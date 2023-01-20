import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
// importing the services / funtions from the canister NFT
// it basicaly gives the information how or which functions are defined
// on the backend in this canister - basicaly a translator between Javascript and motoko
import { idlFactory } from "../../../declarations/nft"
import { idlFactory as token04IdlFactory } from "../../../declarations/token_04_backend"
import { Principal } from "@dfinity/principal";
import Button from "./Button";
import { opentmarketplace_05_backend } from "../../../declarations/opentmarketplace_05_backend";
import Loader from "./Loader";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";


function Item(props) {

  const [nameNFT, setNameNFT] = useState();
  const [owner, setOwner] = useState();
  const [imgUrl, setImage] = useState();
  const [sellButton, setSellButton] = useState();
  const [sellPriceInput, setSellPriceInput] = useState();
  const [loaderHidden, setLoaderHidden ] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState();
  const [priceLabel, setPriceLabel] = useState();
  const [shouldNFTImageDisplay, setShouldNFTImageDisplay] = useState(true);

  // this is the principal id of the nft
  const canisterNFTId = props.canisterID;

  // creating an agent tha can access , request the data
  // so we can fetch that canister on the internt computer blockchain
  const localHost = "http://localhost:8080/";
  // comes from dfinity to help us run HTTP requests in order to get hold of canisters. 
  // so this HttpAgent will make http request on our localhost
  const agent = new HttpAgent({host: localHost});

  // Error: Invalid certificate: Signature verification failed
  // this is the solution and only needed on local machine
  // https://erxue-5aaaa-aaaab-qaagq-cai.raw.ic0.app/agent/interfaces/Agent.html#fetchRootKey
  // this will tell it that while we are working locally simply just fetch the root key to avoid the error above
  // but we have to remove it before live deployment
  // TODO: dont forget to delete this line before live deployment.
  agent.fetchRootKey();

  // this is the nft itself - the actor class;
  let NFTActor;

  // loading nft data
  async function loadNFT() {
    // we are using our agent to get hold of our NFT canister which is called actor
      NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: canisterNFTId.toText()
    });

    // with NFTActor we can now call any of the methods defined
    // in the NFT class actor
    const nameNFT = await NFTActor.getName();
    setNameNFT(nameNFT);
    const owner = await NFTActor.getOwner();
    // setOwner(owner.toText());
    setOwner(String(owner));
    const imageAsBytes = await NFTActor.getImageBytes();
    const imageContent = new Uint8Array(imageAsBytes);
    const imgUrl = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/png"}));
    setImage(imgUrl);
    
    // if the item reside in the /collection 
    if (props.role == "collection" ) {
        // checking if the nft is listed for sale
        // Principal.fromText(props.canisterID)
        // const nftIsListedForSale = await opentmarketplace_05_backend.isListedForSale(Principal.fromText(props.canisterID));
        const nftIsListedForSale = await opentmarketplace_05_backend.isListedForSale(props.canisterID);

        if (nftIsListedForSale) {
            // and reseting the button and the input to the orginal view
            // setSellButton();
            // setSellPriceInput();
            // and idicating the new owner
            setOwner("openMarketPlace");
            // adding a blur effect to the pictures on the screen
            setBlur({filter: "blur(4px)"});
            // set sell status to listed
            setSellStatus("Listed");
        } else { // if it is not listed
          // settign the button for selling the nft
          setSellButton(<Button handleClick={handleSell} text={"Sell"}/>);
        } ;
        // if the item resides in the discovery/
    } else if (props.role == "discover") {

      // checking who is the original owner
      const originalOwner = await opentmarketplace_05_backend.getOriginalOwner(props.canisterID);

      // if the original user is not equle to the current user
      if (originalOwner.toText() != CURRENT_USER_ID.toText() ) {
        // in the dicover route you can buy the NFTs so the button will be set to BUY
        setSellButton(<Button handleClick={handleBuy} text={"Buy"}/>);
      };

      // getting the nfts price
      const nftSellPrice = await opentmarketplace_05_backend.getListedNftPrice(props.canisterID);
      
      // adding the price tag 
      setPriceLabel(<PriceLabel sellPrice={String(nftSellPrice)}/>)

    }
  }

  // we loadNFT only once, when the item gets render - this is why we use
  // the react hook useEffect
  useEffect(() => {
    loadNFT();
  }, []);

  // handling the buy in the discover route
  async function handleBuy () {
      // showing the loader
      setLoaderHidden(false);

      // we are using our agent to get hold of our token_04_backend canister which is called actor
      // this way we will be able to make request to the canister from token and accces
      // its data and call functions.
      const token04Actor = await Actor.createActor(token04IdlFactory, {
        agent,
        // this is the actual id of our token canister that hold all the data of 
        // who has how many tokens (ARTURIONS) etc.
        // TODO: adjust this canister id to your token canister id
        // you can find it out by with the command 
        // dfx canister id token_04_backend
        // in the project running (deployed) token_04_backend 
        canisterId: Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai")
      });

      // getting the principal id of the owner of the nft - this is the seller based  the nft canister id - principal id of nft
      const sellerPrincipalId = await opentmarketplace_05_backend.getOriginalOwner(props.canisterID);
      // getting the nft price based on the nft canister id - principal id of nft
      const nftPrice = await opentmarketplace_05_backend.getListedNftPrice(props.canisterID);

      // now we can make the transfer of token 
      // first argument is the tranfer to (principal id indetifying the owner that will get the tokens)
      // second argument is a number representing the number of tokens required for the transaction
      const transferResult = await token04Actor.transfer(sellerPrincipalId, nftPrice);

      console.log(`transfer: ${transferResult}`);

      // transfer ower the ownership of the nft that was just bought
      // only if the transfer was successful
      if (transferResult == "Success") {
        // Transfer the ownership from the oldOwner (defined by the principal id) to the newOwner (defined by the principal id)
        const transferOwnershipResult = await opentmarketplace_05_backend.transferOwnershipNFT(props.canisterID, sellerPrincipalId, CURRENT_USER_ID);
        console.log(`transfer ownership result: ${transferOwnershipResult}`);
        // affter the transfer will go through successfuly - the nft Image will 
        // disapear from the listing page (from the discover/).
        setShouldNFTImageDisplay(false);
      };

      // hidding the loader after the process is completed
      setLoaderHidden(false);
  };

  // the price to sell the nft
  let price;
  // handling the sell functionality
  function handleSell () {
    // console.log("sell was pressed");
    // when the sell button was pressed then we want to include an input 
    // where we can specified for how much we wan to sell
    setSellPriceInput(
      <input
        placeholder="Price in ARTURIONS"
        type="number"
        className="price-input"
        value={price}
        onChange={(e)=> price=e.target.value }
      />
    );
    // changing the functionality of the button for confirmng the price
    setSellButton(<Button handleClick={sellItem} text={"Confirm"} />)
  };

  // function handling the sell proecess of the item
  async function sellItem() {

    // adding a blur effect to the pictures on the screen
    setBlur({filter: "blur(4px)"});
    // starting the loader - making it visible
    setLoaderHidden(false);

    // calling our backend function for listing an element
    const listingResult = await opentmarketplace_05_backend.listItems(props.canisterID, Number(price));
    console.log("listining " + listingResult);
    
    // if the listing was successful
    if (listingResult == "Success") {
      // we can transfer the ownership
      // and the new owner will be our canister - opentmarketplace_05_backend
      
      // getting the canistes id
      const openMarketPlaceCanisterID = await opentmarketplace_05_backend.getCanisterId();
      // and the transfering to the canister
      const transferResult = await NFTActor.transferOwnership(openMarketPlaceCanisterID);

      console.log("transfer: " + transferResult);
      
      if (transferResult == "Successful transfered ownership of the NFT"){
        // and reseting the button and the input to the orginal view
        setSellButton();
        setSellPriceInput();
        // and idicating the new owner
        setOwner("openMarketPlace");
        // set sell status to listed
        setSellStatus("Listed")
      };

    }

    // and hidding the loader again.
    setLoaderHidden(true);
  };


  return (
    <div style={{display: shouldNFTImageDisplay ? "inline" : "none" }} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={imgUrl}
          style={blur}
        />
        <Loader loaderVisible={loaderHidden} /> 
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {nameNFT}
          </h2>
          <span className="purple-text">{sellStatus}</span>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          { sellPriceInput }
          { sellButton }
        </div>
      </div>
    </div>
  );
}

export default Item;
