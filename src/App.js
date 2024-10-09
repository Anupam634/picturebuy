import React, { useState } from 'react';
import PictureItem from './components/PictureItem'; // Correct path to PictureItem
import Cart from './components/Cart';               // Correct path to Cart

function App() {
  const [pictures, setPictures] = useState([
    { id: 1, name: 'Sunset', price: 10, url: '/images/sunset.jpg' },
    { id: 2, name: 'Mountain', price: 15, url: '/images/mountain.jpg' },
    { id: 3, name: 'Forest', price: 12, url: '/images/forest.jpg' },
  ]);

  const [cart, setCart] = useState([]);

  const handleBuy = (picture) => {
    setCart([...cart, picture]);
  };

  const handlePay = () => {
    const remainingPictures = pictures.filter(
      (picture) => !cart.includes(picture)
    );
    setPictures(remainingPictures);
    setCart([]);
  };

  return (
    <div className="App">
      <h1>Buy Pictures</h1>
      <div className="picture-gallery">
        {pictures.map((picture) => (
          <PictureItem key={picture.id} picture={picture} onBuy={handleBuy} />
        ))}
      </div>

      <Cart cart={cart} onPay={handlePay} />
    </div>
  );
}

export default App;
