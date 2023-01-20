import React, { useEffect, useState } from "react";
import Item from "./Item";

function Gallery(props) {

  const [items, setItems] = useState();

  // rendering all the items based on the array of NFTs
  const fetchNFTs = () => {
    if (props.nftIds != undefined){
      setItems(
        props.nftIds.map((NFTid) => (
          <Item canisterID={NFTid} key={NFTid.toText()} role={props.role} />
        ))
      )
    }
  };
  
  // calling fetchNFTs only once , when this view gets rendered
  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
