import Principal "mo:base/Principal";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

actor Token {
    // this is the users principal id - the owners 
    // your principal id -you can check it by typing in the command line
    // dfx identity get-principal 
    // TODO: DONT FORGET TO ADJUST !! 
    let owner : Principal = Principal.fromText("kae4g-42rhc-4qn66-p5yy6-nn326-dasd-dsad-das");
    // total number of token available
    let totalSupply : Nat = 1000000000;
    // symbol of the token
    let currencySymbol : Text = "ARTURION";


    // stable variable to safe the state of balances bc
    // hashmap cant be stable 
    // creating an array of tupples which is serialize - this variable is very time consuming (computational)
    // this is why we use hashMap
    // and only modifiable from this canister - for safety and security
    private stable var balanceEntries: [(Principal, Nat)] = [];

    // creating the ledger which will store the amount of token 
    // and the id of the user who owns it
    // HashMap<Key, Value> - like a dictionary
    // so each id will be bound with the amount of tokens // (inital size, how to check the key, the third parameter is how to hash these keys)
    // and only modifiable from this canister - for safety and security
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    
    // only assign values when balances is empty - so owner hasent tokens yet!
    if (balances.size() < 1) {
      // now adding the owner and the total supply as of the tokens that the owner has
      // so basicaly the owner has all the tokens
      balances.put(owner, totalSupply); 
    };

    // function checking how much tokens has the given owner with the indetification (principal id)
    // and return the number of tokens owned
    public query func balanceOf(indetification: Principal) : async Nat {
      
      // so balances.get(indetification) sets the balance
      // and if it is null it will have the 0 value
      // if it has the optional result value than it will equal to the result
      let balance : Nat = switch (balances.get(indetification)) {
         case null 0;
         case (?result) result;
      };
      return balance;
    };

    // getting the symbol for the currency
    public query func getSymbol() : async Text {
      return currencySymbol;
    }; 

    // function for payout the free tokens to the given user
    // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/caller-id
    public shared(msg) func payOut() : async Text {
      // msg.caller - this will represents the caller id 
      // Debug.print(debug_show(msg.caller));
      // setting the default value for payout
      let amount = 10000;
      // transfer only the monye if the user , caller id dosent exists yet
      // in the database of the users, if the user dosent exist it will return null
      if (balances.get(msg.caller) == null ) {
        //whoever calls this function will get the default amount 
        // to its account
        
        // we dont want just add to anyone tokens bc we want to have limited suppply
        // balances.put(msg.caller, amount); 
        // so instead we will send the tokens from the canister
        // bc the function gets called by another function this is why the caller will be the canister id!
        // so in order for this to work we have to transfer some money to the canister - which id will always be difrent
        // after strting the dfx - this is why we do it from comand line
        let result = await transfer(msg.caller, amount);
        //if canister runs out of money than it wont have enough fund for the transfer 
        return result;
      } else {
        return "Already Claimed!";
      };
    };

    // transfer tokens to anotehr user
    public shared(msg) func transfer(transferTo: Principal, amount: Nat) : async Text {
      // if we call the payOut function in here
      // let result = await payOut();
      // then the id from payOut will be equle to the id of the canister
      // bc the canister would be the caller in this case

      // the balance of the person who will do the transfer
      let personFromBalance = await balanceOf(msg.caller);

      // check if enough funds to go with the transfer
      if (personFromBalance >= amount) {
        // new balance for person transfering
        let newBalancePersonTransfering : Nat = personFromBalance - amount;
        // update the balance of the person transfering
        balances.put(msg.caller, newBalancePersonTransfering); 
        
        // getting curretn balance of person receiving
        let currentBalancePersonReceiving = await balanceOf(transferTo);
        // update the balance of the person reciving the transfer
        balances.put(transferTo, currentBalancePersonReceiving + amount); 

        return "Success";
      } else {
        return "Not enough funds!"
      } 

    };


    // The preupgrade method lets you make a final update to stable variables, 
    // before the runtime commits their values to Internet Computer stable memory, and 
    // performs an upgrade. The postupgrade method is run after an upgrade has initialized 
    // the replacement actor, including its stable variables, but before executing any 
    // shared function call (or message) on that actor.
    // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/upgrades#preupgrade-and-postupgrade-system-methods

    // before upgrade of the actor
    system func preupgrade() {
      // := - reasign a new value
      balanceEntries := Iter.toArray(balances.entries());
    };

    // after the upgrade of the actor we shift the values
    system func postupgrade() {
      balances := HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 1, Principal.equal, Principal.hash );

      // only assign values when balances is empty
      if (balances.size() < 1) {
        // now adding the owner and the total supply as of the tokens that the owner has
        // so basicaly the owner has all the tokens
        balances.put(owner, totalSupply); 
      };
      // after that the only way the balances will be modified is with transfer method
    
    };


};


