import React, { useState } from 'react';
import PictureItem from './components/PictureItem'; // Correct path to PictureItem
import Cart from './components/Cart';               // Correct path to Cart

function App() {
  const [pictures, setPictures] = useState([
    { id: 1, name: 'Bitcoin', price: 10, url: '/images/bitcoin.jpg' },
    { id: 2, name: 'Ethereum', price: 15, url: '/images/ethereum.jpg' },
    { id: 3, name: 'Solana', price: 12, url: '/images/solana.jpeg' },
    { id: 4, name: 'Bnb', price: 12, url: '/images/bnb.png' },
  ]);

  const [cart, setCart] = useState([]);

  const handleBuy = (picture) => {
    // Check if the picture is already in the cart
    const isInCart = cart.some(item => item.id === picture.id);
    if (!isInCart) {
      setCart([...cart, picture]);
    } else {
      alert("This picture is already in your cart!"); // Optional: Notify user
    }
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
