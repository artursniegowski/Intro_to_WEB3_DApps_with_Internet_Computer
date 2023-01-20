import React from "react";

// a component designed to imitate loading.

function Loader(props) {
    return (
        <div hidden={props.loaderVisible ? true : false} className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
      </div>
    )
};

export default Loader;