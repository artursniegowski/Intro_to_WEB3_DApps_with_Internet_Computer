import List "mo:base/List";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Bool "mo:base/Bool";

// creating the canister
actor DKeeper {

  // create an object that is accesible from out of
  // this scope !
  public type Note = {
    title: Text;
    content: Text;
  };

  // creating a variable notes of type List and each element will be the type
  // of type Note - and we make it persistant with stable key word
  // https://internetcomputer.org/docs/current/references/motoko-ref/List
  stable var notes: List.List<Note> = List.nil<Note>();

  // create note function
  public func createNote(titleText: Text, contentText: Text) {
    
    // creating a new note and filling it with data
    let newNote: Note = {
      title = titleText;
      content = contentText;
    };

    // adding element to the list by adding it at the beginning
    // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/List#function-push
    // func push<T>(x : T, l : List<T>) : List<T>
    notes := List.push(newNote, notes);  
    // printing our lists
    Debug.print(debug_show(notes));
  };


  // creating a read operation - reading the notes
  // and we return an array of notes - this will it make more easier
  // to convert to JavaScript
  public query func readNotes() : async [Note] {
    // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/List#function-toarray
    // func toArray<A>(xs : List<A>) : [A]
    return List.toArray(notes); 
  };

  // deleting a note from the List notes
  public func removeNote(id: Nat) {

    // Debug.print(debug_show(id));
    // Debug.print(debug_show(notes));

    // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/List#function-take
    // Returns the first n elements of the given list
    let startList =  List.take(notes, id);
    // Debug.print(debug_show(startList));

    // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/List#function-drop
    // drops the first n elements of the given list = index + 1 bc index starts with 0
    let endList =  List.drop(notes, id + 1);
    // Debug.print(debug_show(endList));

    // https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/base/List#function-append
    // Append the elements from one list to another list. and overite the notes. 
    notes := List.append(startList,endList); 
    // Debug.print("Total list");
    // Debug.print(debug_show(notes));

  };

}
