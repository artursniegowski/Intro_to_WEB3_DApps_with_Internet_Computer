import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";
// creating a canister just for minting NFTs
// https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/actors-async#actor-classes-generalize-actors
//actor classes allows us to create canisters programatically. This is why we use a class
// it will have a name, a owner and contetn whihc is an array of 8 bit natural number
// binding this keyword to the entire NFT actor class
actor class NFT (name: Text, owner: Principal, content: [Nat8]) = this {
    
    // every time a canister will be created it will have
    // a unique principal id - so each nft will we unique

    // data for the canister - for the NFT
    // private data makes it possible to access only from within this class
    private let itemName = name; 
    // the owner can be change after selling the nft
    private var nftOwner = owner;
    private let imageBytes = content;

    // returns the name
    public query func getName() : async Text {
        return itemName;
    };

    // returns the owner
    public query func getOwner() : async Principal {
        return nftOwner;
    };

    // returns the content - image as bytes
    public query func getImageBytes() : async [Nat8] {
        return imageBytes;
    };

    // get canisters unique id - principal
    public query func getCanisterId(): async Principal {
        // return Principal.fromActor(NFT); - normally we can do this
        // but in this case we woudl have to pass all the arguments so this is why we
        // use the 'this' reference 
        return Principal.fromActor(this);
    };

    // we want to make sure that we only transfer the item if that transfer function
    // is being called by the owner of the nft
    // shared function so we can tap into the msg caller - whihc will hold the pricipal 
    // id of the person calling this function
    // this function will change the owner of the NFT ,
    // the argument is the new Owner ID - principal
    public shared(msg) func transferOwnership (newOwnerId: Principal) : async Text {
        if (msg.caller ==  nftOwner) {
            // changing the owner 
            nftOwner := newOwnerId;
            return "Successful transfered ownership of the NFT";
        } else {
            // the person dosent own this nft - so we simply going to stop
            return "Error: Not initated by NFT owner";
        }
    };

};

