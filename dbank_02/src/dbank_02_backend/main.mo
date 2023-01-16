// imoprting debug
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

// create a class that will hold our carnister
actor DBank {
  // creating a persistant variable - holdning state - money value
  stable var currentValue: Float = 300; 
  // reset values 
  currentValue := 300;
  // Debug.print(debug_show(currentValue));
  
  // getting the current time
  stable var startTime = Time.now() ;
  // startTime := Time.now() ;
  // Debug.print(debug_show(startTime));

  // public function - accesible from outside the scope of DBank
  // adding given amount to the current value
  public func topUp(amount: Float) {
    currentValue += amount;
    Debug.print(debug_show(currentValue));
  };

  // function that allows the user to withdraw money
  public func withdraw(amount: Float) {
    // assinging a type to the variable tempValue
    let tempValue: Float = currentValue - amount;
    // if/else conditionals 
    if (tempValue >= 0) {
      currentValue -= amount;
      Debug.print(debug_show(currentValue));
    } else {
      Debug.print("You dont have enough money on the account!");
    }
  };

  // creating a query - read only - function
  public query func checkBalance(): async Float {
    // it is red-only operation
    return currentValue;
  };

  // this will be an update method
  // to calculate the compund interest
  public func compound() {
    // getting the curretn time
    let currentTime = Time.now(); 
    // how much time did elapse
    let timeElapsedNanoSeconds = currentTime - startTime;
    // converting to seconds
    let timeElpasedSeconds = timeElapsedNanoSeconds / 1000000000;

    // replace the curretn value with the compounded value
    // converting types to the same type 
    currentValue := currentValue * (1.01 ** Float.fromInt(timeElpasedSeconds)); 
  
    // reseting the stasrt time for the compound value
    // since once alredy calculated
    startTime := currentTime;
  };

}
