import React, { useState } from "react";
import { token_04_backend, canisterId, createActor } from "../../../declarations/token_04_backend/index";
import { AuthClient } from "@dfinity/auth-client";

function Faucet(props) {

  const [buttonDisabled, setDisabled] = useState(false)
  const [buttonText, setButtonText] = useState("Gimme gimme");



  async function handleClick(event) {
    // disable the button after sending the request for the 
    // addition of 10000 tokens
    setDisabled(true);
    
    // ############### AUTHENTICATION ##########################
    //⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️⬇️
    // // creatin authentication client the same as in the index.jsx file
    // const authClient = await AuthClient.create();
    // const identity = await authClient.getIdentity();
    // // create actor and canisterId are from declarations !
    // const authenticatedCanister = createActor(canisterId, {
    //   agentOptions: {
    //     identity,
    //   },
    // });
    // // just to consol log the identity!
    // console.log(String(identity.getPrincipal()));
    // const textForButton = await authenticatedCanister.payOut();
    // ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️
    // ############### AUTHENTICATION ##########################

    const textForButton = await token_04_backend.payOut();
    // set the text for the button as the returned message 
    setButtonText(textForButton);
    // enable the button agian when the operation is done
    // setDisabled(false);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free Arturions tokens here! Claim 10,000 ARTURIONS tokens to your account: "{props.userIdPrincipal}" .</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={buttonDisabled ? true : false}>
          {buttonText}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
