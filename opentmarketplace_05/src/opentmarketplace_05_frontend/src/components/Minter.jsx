import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { opentmarketplace_05_backend } from "../../../declarations/opentmarketplace_05_backend";
import Item from "./Item";
import Loader from "./Loader";

function Minter() {

  // not the native hook from rect
  // used to handle forms
  const {register, handleSubmit} = useForm();
  // setting the nftPrincipal
  const [nftPrincipal, setNFTPrincipal] = useState("");
  // controls wehn the loader hidden apears adn disapears
  const [loaderHidden, setLoaderHidden] = useState(true);

  // handle data from our form
  // wiht the help of the useForm hook
  async function onSubmit(data) {
    // show the loader
    setLoaderHidden(false);

    const name = data.name;
    const image = data.image[0];
    // https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer
    // it returns a promis so it is asynchronous and we have to use the await key word
    // to wait for the result to be ready
    const imageByteData = [...new Uint8Array(await image.arrayBuffer())];

    const newNFTId = await opentmarketplace_05_backend.mint(imageByteData, name);
    // print the newly minted NFT ID
    // console.log(newNFTId.toText());
    // setting the nftPrincipal to the new NFT ID
    setNFTPrincipal(newNFTId)

    // hidde the loader
    setLoaderHidden(true);

  }

  if (nftPrincipal == "") {
    return (
      <div className="minter-container">
        <Loader loaderVisible={loaderHidden} />
        <h3 className="makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Create NFT
        </h3>
        <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
          Upload Image
        </h6>
        <form className="makeStyles-form-109" noValidate="" autoComplete="off">
          <div className="upload-container">
            <input
              {...register("image", {required: true})}
              className="upload"
              type="file"
              accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
            />
          </div>
          <h6 className="form-Typography-root makeStyles-subhead-102 form-Typography-subtitle1 form-Typography-gutterBottom">
            Collection Name
          </h6>
          <div className="form-FormControl-root form-TextField-root form-FormControl-marginNormal form-FormControl-fullWidth">
            <div className="form-InputBase-root form-OutlinedInput-root form-InputBase-fullWidth form-InputBase-formControl">
              <input
              {...register("name", {required: true})}
                placeholder="e.g. CryptoDunks"
                type="text"
                className="form-InputBase-input form-OutlinedInput-input"
              />
              <fieldset className="PrivateNotchedOutline-root-60 form-OutlinedInput-notchedOutline"></fieldset>
            </div>
          </div>
          <div className="form-ButtonBase-root form-Chip-root makeStyles-chipBlue-108 form-Chip-clickable">
            <span onClick={handleSubmit(onSubmit)} className="form-Chip-label">Mint NFT</span>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="minter-container">
        <h3 className="Typography-root makeStyles-title-99 Typography-h3 form-Typography-gutterBottom">
          Minted!
        </h3>
        <div className="horizontal-center">
          <Item canisterID={nftPrincipal} />
        </div>
      </div>
    );
  }
}

export default Minter;
