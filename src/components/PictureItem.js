import React, { useState } from 'react';
import '../App.css';

const PictureItem = ({ picture, onBuy }) => {
  const [added, setAdded] = useState(false);

  const handleBuy = () => {
    onBuy(picture);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="picture-item">
      <img src={picture.url} alt={picture.name} />
      <h3>{picture.name}</h3>
      <p>Price: ${picture.price}</p>
      <button className="buy-button" onClick={handleBuy}>
        Buy
      </button>
      {added && <p className="added-notification">Added to cart!</p>}
    </div>
  );
};

export default PictureItem;
