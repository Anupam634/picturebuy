import React from 'react';

function Cart({ cart, onPay }) {
  const totalPrice = cart.reduce((sum, picture) => sum + picture.price, 0);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>{item.name} - ${item.price}</li>
        ))}
      </ul>
      <h3>Total: ${totalPrice}</h3>
      <button onClick={onPay}>Pay</button>
    </div>
  );
}

export default Cart;
