import React, { useState, useEffect } from 'react';
import './App.css';
import Note from './components/Note';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateNote from './components/CreateNote';
// importing the motoko canister - specified in dfx.json
import { dkeeper_app_03_backend } from '../../declarations/dkeeper_app_03_backend'

function App() {
  // variable to store the notes - array of objects 
  const [notes, setNotes] = useState([]);

  // adding a note to the array of notes
  const addNote = (note) => {
    setNotes((prevStoredValuesInNotes)=>{
      // addin the note to the array in mototko
      dkeeper_app_03_backend.createNote(note.title, note.content);

      // taking first the previous stored array and spreding it
      // then adding the new note at the begining of the array bc mokoto
      // returns the array in revers order - the newest at the begining.
      return [note, ...prevStoredValuesInNotes];
    });
  };

  // adding another hook - useEffect from React
  // to make sure, every time the page gets rerender it will update the variable
  // so if the variable gets change it will update the page with its value
  // or if an empty array is passed as the second argument it will be called only once
  // https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // it is splited into fucntions bc fetchData has to be asynchronous
    fetchData();
  }, []);

  // reading notes from the backend
  const fetchData = async () => {
    // reading notes from the backend
    const notesArray =  await dkeeper_app_03_backend.readNotes();
    // and now we can update our notes with the useState
    setNotes(notesArray);
  };


  // the index is passed from the note
  // deleting a note with the given index
  const deleteNote = (indexId) => { 
    // errasing the data on the backend too. 
    // we dont have to wait for th process to finish to show to the user the
    // result right away
    dkeeper_app_03_backend.removeNote(indexId);

    // first we tap into the current array
    setNotes( (prevStoredValuesInNotes) => {
      // next we filter the current array -
      // we return all the values back except for the one
      // with the passed index
      return prevStoredValuesInNotes.filter((element, index) => {
        // if this statement is true, than the value will be passed 
        // back to the array
        return index !== indexId;
      });
    });
  };

  return (
    <div>
      <Header />
      <CreateNote onAddNote={addNote} />
      {notes.map((note, index)=> {
         return <Note 
              key={index}
              index={index}
              title={note.title} 
              content={note.content}
              onDeleteNote={deleteNote}
            /> 
      })}
      <Footer />
    </div>
  )
};


export default App;
