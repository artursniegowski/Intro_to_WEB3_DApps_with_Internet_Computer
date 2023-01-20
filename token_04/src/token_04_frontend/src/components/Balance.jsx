import React, { useState } from "react";
import { token_04_backend } from '../../../declarations/token_04_backend'
// importing motoku modules on the frontend
import { Principal } from '@dfinity/principal'

function Balance() {
  
  const [inputValue, setInputValue] = useState("");
  const [balanceResult, setBalanceResult] = useState("");
  const [cryptoSymbol, setCryptoSymbol] = useState("")
  const [isHidden, setHidden] = useState(true);

  // creating a closed component - only one variable for the input.
  const inputValueOnChange = (event) => {
    setInputValue(event.target.value);
  };

  async function handleClick() {
    // console.log("Balance Button Clicked");
    // we have to convert the string into a principal that we can pass it to the backend
    // this is done with the use of importing from motoko the Principal library
    // and then we call the backend function to check the balance for the given principal
    const currentBalance = await token_04_backend.balanceOf( Principal.fromText(inputValue) );
    // we have to format the result to a string bc it will come in format 1_000_000_000n
    setBalanceResult(currentBalance.toLocaleString());
    // setting the currency symbol
    setCryptoSymbol(await token_04_backend.getSymbol());
    // make the message with balance vissible
    setHidden(false);
    }


  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a Principal ID"
          value={inputValue}
          onChange={inputValueOnChange}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p className={isHidden ? "hidden": null}>This account has a balance of {balanceResult} {cryptoSymbol}.</p>
    </div>
  );
}

export default Balance;
