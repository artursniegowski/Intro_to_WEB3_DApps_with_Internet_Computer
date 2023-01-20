// CreateNote component
import React, { useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';


function CreateNote(props) {

    // for expangint the note
    const [isExpanded, setExpanded] = useState(false);

    // creating variable for the inputs, for the note
    const [note, setNote] = useState({
        title: "",
        content: "",
    });


    // creating clossed componenet for text input and textarea
    // one function for all the inputs !
    const updateNote = (event) => {
        // const name = event.target.name
        // const value = event.target.value
        const {name, value} = event.target

        setNote( (prevValueForNote) => {
            return {
                // this way we keep the part of object
                // that is not currently changed
                ...prevValueForNote,
                // and update the value from the object that was
                // called from
                [name]:value,
            }
        });
    };


    const addNoteToArray = (event) => {
        // after clicking on the button Add
        // calling the function from props 
        // and passing an object Note - containg the title and content
        props.onAddNote(note);
        // setting back to default values the title and content
        setNote({
            title:"",
            content:""
        });
        
        // this will cause that the normal form behaviour
        // will be prevented, whihc is the refreshing
        // of the website - it wont happen
        event.preventDefault();    
    };

    // function for setting the expand status
    const expandNote = () => {
      setExpanded("true");
    }

    return (
        <div>
        <form className="create-note">
          {/* only shows when expanded */}
          {isExpanded &&
          <input 
            name="title" 
            placeholder="Title" 
            onChange={updateNote}
            value={note.title}
          />}
          <textarea 
            name="content" 
            placeholder="Take a note..." 
            rows={isExpanded ? "3" : "1"} 
            onChange={updateNote}
            onClick={expandNote}
            value={note.content}    
            />
          {/* zoom componenet from material ui */}
          {/* only to zoom in when isExpanded = true */}
          <Zoom in={isExpanded ? true : false}>
            {/* floating action button from material ui */}
            <Fab 
              onClick={addNoteToArray}>
              <AddCircleOutlineIcon /> 
            </Fab>
          </Zoom>
        </form>
      </div>
    )
}

export default CreateNote;