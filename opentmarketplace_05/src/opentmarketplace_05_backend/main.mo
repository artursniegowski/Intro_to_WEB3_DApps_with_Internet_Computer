import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Cycles "mo:base/ExperimentalCycles";
// importing our nft class actor file
import NFTActorClass "../NFT/nft";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";

actor openTMarketplace { 
    
    // we going to create a map of NTS so we know
    // who owns, which NFTS
    // they keys will be Principals - of each new carnister that gets created with for the NFT
    // and then it is going to be linked to NFT canisted stored in nft.mo NFTActorClass.NFT
    // and at the end initializing the hashmap, init size 1, function for matching it will be Principal equals
    // and we will use principal.hash to hash these keys
    var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
    
    // creatint he map of owners - so we know which owner has which nfts
    // so the keys will be the principla ids of the owners of the nfts 
    // and the values will be a list of principal id of the minted nfts - the carnisters that are unique
    // and the we initialize it with a seize of 1, matching function of matching Principals with equal
    // and with the Pincipal.hash to hash the keys
    var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);

    // creating custom type for the mapOfListings
    // this will hold the Principal of the owner and the price of the NFT
    private type Listing = {
        itemOwner: Principal;
        itemPrice: Nat;
    };

    // hashmap of all the listings
    // they key will be an Principal of the listed NFT
    // and the value will be a custom type that will hold the price of the nft, the owners Principal, and maybe hsitory of sale
    // and the init as in the above hash functions
    var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);



    // this function for minting will take the picture as an array of 
    // array of 8 bytes of Nat , and the name of the NFT - image to be minted
    // and once teh minting is done we will return the Principal of the newly minted canister
    // which of course identifies the data in a unique way
    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
        // this is why we making this function shared so we can tap into the 
        // msg , which will be the principal of the caller of this funciton - so the
        // person who calls it
        let owner : Principal = msg.caller;

        // the cycles will come from the main canister and will be allocated here
        // just print statemnt to check it
        Debug.print(debug_show(Cycles.balance()));
        // bc this is a new canister it will need cycles
        // before we can creat the canister and run it we have to allocate the cycles
        // we can do it with - ExperimentalCycles 
        // to create a canister it shoudl cost 100_000_000_000
        // and to keep it running we add 100_000_000_000 and some extra
        Cycles.add(190_000_000_000);
        
        // creating the NFT
        let newNFT = await NFTActorClass.NFT(name, owner, imgData); 

        // just print statemnt to check it
        Debug.print(debug_show(Cycles.balance()));

        // setting the principal
        let newNFTPrincipal = await newNFT.getCanisterId();
        
        // adding the newly created canister - or its principal to the hashmap
        // with the key being the new nft principal
        // and the value it is going to be the new NFT
        mapOfNFTs.put(newNFTPrincipal, newNFT);
        
        // matching the nfts with the owner
        // updating the hashmap of the owners
        addToOwnershipMap(owner, newNFTPrincipal);

        // return the principal
        return newNFTPrincipal;
    };

    // function used to adding newly created NFTs as a list to their coresponding 
    // owners
    // it is privet bc we want only to be available in this motoko file
    // it takes two arguments the owners Principal and the newly created NFT principal so
    // they can be matched
    private func addToOwnershipMap(owner: Principal, nftId: Principal) {
        // first retriving the NFTs owned by the given user
        // but if the owner dosent exists yet , he needs to be added to the list
        // this is why we using a switch statement
        var ownedNFTs: List.List<Principal> = switch(mapOfOwners.get(owner)){
            // in case it the is no owner found we will return an empty list
            case null List.nil<Principal>();
            // in case we get a result we will change the output from optional
            // ?result to normal result
            case (?result) result;
        };

        // now we can push the list of nft to the hashmap
        // so adding the nftId - the principal to the liest of nfts
        ownedNFTs := List.push(nftId, ownedNFTs);

        // now we can add the nfts owned to the hashmp of owners
        // where the kye will be the principal of the owner
        // and the value will be the list of ownedNFTs
        mapOfOwners.put(owner, ownedNFTs);
    };

    // this function is going to fetch that list of IDs
    // and turning it into an array that can be used on the frontend
    // we going to pass the pricipal id of a user and we will try to return 
    // all the nfts that the user owns (this will be a list of principals)
    public query func getOwnedNFTs (user: Principal) : async [Principal] {
        // getting the list of NFT canister ids that belong to the given user
        var listOfdNFTs: List.List<Principal> = switch(mapOfOwners.get(user)){
            // in case it the is no owner found we will return an empty list
            case null List.nil<Principal>();
            // in case we get a result we will change the output from optional
            // ?result to normal result - unwraping the results and return the unwrpaed results
            case (?result) result;
        };

        // this will convert the list of principals to an array
        return List.toArray(listOfdNFTs);
    };

    // returns an array of principal id of the listed nfts
    public query func getListedNFTs() : async [Principal] {
        // returns and iter of all the keys with keys()
        // and then create an array of this keys with Iter
        let nftListedId = Iter.toArray( mapOfListings.keys()); 
        return nftListedId;
    };



    // shared function bc this will allow to get hold of the callers ID
    // this function will list the selected nfts - mark them for sale
    // the id is goign to be a principal type of the NFT thats being listed
    // and the second argument is the price for which the NFT is going to be lsited
    public shared(msg) func listItems(id: Principal, price: Nat) : async Text {
        // first we getting the NFT with the given Principal - id 
        // and we check if it exists bc it can be optional 
        var item: NFTActorClass.NFT = switch(mapOfNFTs.get(id)) {
            // in case the key dosent exists - return with a message !
            case null return "NFT does NOT exist!";
            // in case the result exists converts the optional result into actual result
            case (?result) result;
        };

        // checking the owner of the nft - if it matches the owner of the caller of
        // this function - you can list only items you own
        let ownerNFT = await item.getOwner();

        //checking if the pricipals match
        if (Principal.equal(ownerNFT, msg.caller)) {
            // if the user actually match we can create a new listing in our mapOfListings
            // first creating a new listing obejct
            let newListing : Listing = {
                itemOwner = ownerNFT;
                itemPrice = price;
            }; 
            // and then we can add the listing to our map of lsitings - into our array
            // the key will be the id of the nft listed and the value will be the new listing
            mapOfListings.put(id,newListing);

            return "Success";

        } else {
            return "You dont own this NFT! BYE BYE!";
        };
    };

    // get canisters unique id - principal
    public query func getCanisterId(): async Principal {
        // return Principal fromActor  openTMarketplace 
        // we dont have to use this keword bc it dosent have any arguments
        // so we can simply pass the actor 
        return Principal.fromActor(openTMarketplace);
    };


    // checks if item is listed for sale
    // for the given NFT id
    public query func isListedForSale (nftId: Principal) : async Bool {
        // checks if the id exists in the list.
        if (mapOfListings.get(nftId) == null) {
            return false;
        } else {
            return true;
        };
    };

    // getting the orignal owner of the nft
    // this function will take the principal - id - of the actual NFT that we check
    // to which user it belongs
    // returnign the principal id of the original user owning it
    public query func getOriginalOwner(nftId: Principal) : async Principal {
        var listing: Listing = switch(mapOfListings.get(nftId)) {
            // if we cant find any matching nft principal, than we return an empty principal
            case(null) { return Principal.fromText(""); };
            // but if we find a matching nft then we will uwrap from optional result to result
            case(?result) { result };
        };

        // and then we will return the owner of the NFT - principal
        return listing.itemOwner; 
    };

    // getting the nfts price listed for sale
    // taking as argument the nftId - principal of the nft and returning its price
    public query func getListedNftPrice(nftId: Principal) : async Nat {

        // getting the listing item which icludes the price and the owner of the NFT
        var listing: Listing = switch(mapOfListings.get(nftId)) {
            // if we cant find any matching nft principal, than we return 0
            case(null) { return 0; };
            // but if we find a matching nft then we will uwrap from optional result to result
            case(?result) { result };
        };

        // and then we will return the owner of the NFT - principal
        return listing.itemPrice; 
    };


    // changing the owner of an NFT, after an successful purchase
    // takes three arguments :
    // the nftId - principal for the NFT to be sold
    // oldOwner - principal of the current owner that is selling
    // newOwner - principal of the new owner that has bought the NFT
    // and text as result
    public shared(msg) func transferOwnershipNFT(nftId: Principal, oldOwner: Principal, newOwner: Principal) : async Text {
        // getting the purchesed nft, from the map of NFTs and unwrpaing if from the optional result
        let purchasedNFT : NFTActorClass.NFT = switch(mapOfNFTs.get(nftId)) {
            case(null) { return "NFT does NOT exist!" };
            // unwraping the result from optiona result to result
            case(?result) { result };
        };

        // transfering the NFT to the new owner
        let transferResult = await purchasedNFT.transferOwnership(newOwner);

        // if transfer was successful
        if (transferResult == "Successful transfered ownership of the NFT"){
            // deleting the item from the map of NFT listings
            mapOfListings.delete(nftId);
            // getting hold of the list of NFTs that the previous owner owned
            var ownedNFTs : List.List<Principal> = switch(mapOfOwners.get(oldOwner)) {
                // if null then we going to return an empty list
                case(null) { List.nil<Principal>() };
                // otherwise unwrpaing the result
                case(?result) { result };
            };
            // we will filter the list of NFTs that the previous owner owned
            // so basivcaly removing the NFT that was just sold from the list of old owner nfts list
            // the filter function works that way tha if it returns true than the element
            // get passed to the list , if false than the element wont be included in the new list
            // and at teh end reasignignt the filtered values to the old list - this way we update the list of NFTs owned by the oldOwner
            // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/List#function-filter
            ownedNFTs := List.filter(ownedNFTs, func (listItemId: Principal) : Bool {
                // only if the principals match it will retun false and it wont get passed to the new list
                return listItemId != nftId;
            });
            // and finally we are going to add this to the ownership map of the new map
            addToOwnershipMap(newOwner, nftId);

            return "Success";

        } else {
            return transferResult;
        };
    };
};
