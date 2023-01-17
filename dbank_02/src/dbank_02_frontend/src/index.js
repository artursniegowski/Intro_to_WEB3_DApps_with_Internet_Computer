// importing the dbank module
import { dbank_02_backend } from "../../declarations/dbank_02_backend"

//Everytime the windows loads up - update the value of current balance
window.addEventListener("load", async (event)=> {
  // updating the value of this element
  // with mokoto currentValue data 
  // since it is a asynchronous method we have to wait for the result.
  // it is a promise - showing only the last two digits - accuracy
  updateCurrentValue();
});

// adding event listener on the form , on submit
const formElement = document.querySelector("form");
formElement.addEventListener("submit", async (event) => {
  // removing the default action of form - submititng the form
  event.preventDefault();

  // getting the values of input elements from the form
  const inputElementTopUp = document.getElementById("input-amount");
  const inputElementWithdraw = document.getElementById("withdraw-amount");

  // disable the button to give the user an indication that somethign is happening
  const submitButton = document.getElementById("submit-btn");
  submitButton.setAttribute("disabled", "");

  // getting the values from the form from that the user inputed
  // we need to convert the returned values from string to float
  // bc this is waht our topUp function will expect to use as argument.
  const inputAmout = parseFloat(inputElementTopUp.value);
  const withdrawAmount = parseFloat(inputElementWithdraw.value);

  // only if the inputAmount is greater equel to 0 so it dosent messed up our porgram
  if (inputAmout >= 0) {
    // getting the current balnce from the dbank
    await dbank_02_backend.topUp(inputAmout);
  };

  // only if the withdraw amount is a vlid number
  if (withdrawAmount) {
    // withdraw the money
    await dbank_02_backend.withdraw(withdrawAmount);
  };

  // everytime the user will add some money or take some money out
  // we will compoud the money
  await dbank_02_backend.compound(); 

  // updating the current value after adding the amount
  updateCurrentValue();

  // clean the data from the input value / from the form
  inputElementTopUp.value = "";
  inputElementWithdraw.value = "";

  // enable the button after the process is done
  submitButton.removeAttribute("disabled");

});

// updates the currentValue of the Bank
const updateCurrentValue = async () => {
  let currentValue = (Math.round((await dbank_02_backend.checkBalance())*100))/100;
  document.getElementById("value").innerText = currentValue;
}