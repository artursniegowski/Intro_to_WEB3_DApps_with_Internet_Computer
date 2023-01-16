// Header component
import React from 'react';
import SummarizeIcon from '@mui/icons-material/Summarize';

function Header() {
    return (
        <header>
            <h1>
            <SummarizeIcon sx={{ fontSize: 40 }}/>
            Keeper App
            </h1>
        </header>
    )
}

export default Header;