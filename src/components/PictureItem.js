import React from 'react';

function PictureItem({ picture, onBuy }) {
  return (
    <div className="picture-item">
      <img src={picture.url} alt={picture.name} width="150" />
      <p>{picture.name}</p>
      <p>Price: ${picture.price}</p>
      <button onClick={() => onBuy(picture)}>Buy</button>
    </div>
  );
}

export default PictureItem;
