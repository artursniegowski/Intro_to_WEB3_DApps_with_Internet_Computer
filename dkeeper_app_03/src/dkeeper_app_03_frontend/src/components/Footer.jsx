import React from 'react';
// Footer component

function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer>
            <p>Coppyright ⓒ{currentYear}</p>
        </footer>
    )
}

export default Footer;