import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface _SERVICE {
  'getCanisterId' : ActorMethod<[], Principal>,
  'getListedNFTs' : ActorMethod<[], Array<Principal>>,
  'getListedNftPrice' : ActorMethod<[Principal], bigint>,
  'getOriginalOwner' : ActorMethod<[Principal], Principal>,
  'getOwnedNFTs' : ActorMethod<[Principal], Array<Principal>>,
  'isListedForSale' : ActorMethod<[Principal], boolean>,
  'listItems' : ActorMethod<[Principal, bigint], string>,
  'mint' : ActorMethod<[Uint8Array, string], Principal>,
  'transferOwnershipNFT' : ActorMethod<
    [Principal, Principal, Principal],
    string
  >,
}
