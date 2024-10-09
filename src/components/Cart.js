import React from 'react';
import '../App.css';

const Cart = ({ cart, onPay, onRemove }) => {
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <span>{item.name}</span>
              <span>${item.price}</span>
              <button onClick={() => onRemove(item)} style={{ background: 'transparent', border: 'none', color: '#dc3545' }}>Remove</button>
            </div>
          ))}
          <div className="total">Total: ${totalPrice}</div>
          <button className="buy-button" onClick={onPay}>
            Pay
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
