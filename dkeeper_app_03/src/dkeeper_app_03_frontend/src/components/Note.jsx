// Note component
import React from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function Note(props) {

    return (
        <div className='note'>
            <h1>{props.title}</h1>
            <p>{props.content}</p>
            <button 
                // when the button gets clicked - call the delete method
                // on the index passed witht he note
                onClick={ () => {props.onDeleteNote(props.index)}}>
                    <DeleteForeverIcon />
                </button>
        </div>
    )
}

export default Note;