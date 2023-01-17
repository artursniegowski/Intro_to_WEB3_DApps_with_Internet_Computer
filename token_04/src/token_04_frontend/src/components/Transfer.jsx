import React, { useState } from "react";
import { token_04_backend, canisterId, createActor } from "../../../declarations/token_04_backend/index";
// importing motoku modules on the frontend
import { Principal } from '@dfinity/principal'
import { AuthClient } from "@dfinity/auth-client";


function Transfer() {
  
  // creating variables and closed compoenents
  const [amount, setAmount] = useState("");
  const [transferToId, setTransferToId] = useState("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [transferMessage, setTransferMessage] = useState("");
  const [isHiddenTransferMessage, setHiddenTransferMessage] = useState(true);

  async function handleClick() {
    // disabling the button while the transfer is active
    setButtonDisabled(true);
    // collecting the data and changing its type
    const personReceiving = Principal.fromText(transferToId);
    const amountToTransfer = Number(amount)


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
    // // transfering the money
    // const transferStatus = await authenticatedCanister.transfer(personReceiving,amountToTransfer);
    // ⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️⬆️
    // ############### AUTHENTICATION ##########################


    // transfering the money
    const transferStatus = await token_04_backend.transfer(personReceiving,amountToTransfer);
    setTransferMessage(transferStatus);
    setHiddenTransferMessage(false);
    
    // enable the button after the transfer is done
    setButtonDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={transferToId}
                onChange={(event) => setTransferToId(event.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button disabled={isButtonDisabled ? true : false} id="btn-transfer" onClick={handleClick} >
            Transfer
          </button>
        </p>
        <p hidden={isHiddenTransferMessage ? true : false}>{transferMessage}</p>
      </div>
    </div>
  );
}

export default Transfer;
