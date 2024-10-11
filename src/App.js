import React, { useState } from 'react';
import PictureItem from './components/PictureItem';
import Cart from './components/Cart';
import { ethers } from 'ethers'; // Updated import for ethers.js v6
import './App.css';

function App() {
  const [pictures, setPictures] = useState([
    { id: 1, name: 'Bitcoin', price: 0.01, url: '/images/bitcoin.jpg' },
    { id: 2, name: 'Ethereum', price: 0.012, url: '/images/ethereum.jpg' },
    { id: 3, name: 'Solana', price: 0.013, url: '/images/solana.jpeg' },
    { id: 4, name: 'Bnb', price: 0.015, url: '/images/bnb.png' },
  ]);

  const [cart, setCart] = useState([]);
  const [account, setAccount] = useState(null);

  // Set ETH to USD conversion rate to a fixed value of 2450
  const fixedEthToUsdRate = 2450;

  // Connect the user's MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        console.log('Connected account:', accounts[0]);
      } catch (error) {
        console.error('Connection error:', error);
      }
    } else {
      alert('Please install MetaMask');
    }
  };

  // Add an item to the cart
  const handleBuy = (picture) => {
    const isInCart = cart.some((item) => item.id === picture.id);
    if (!isInCart) {
      setCart([...cart, picture]);
    } else {
      alert('This picture is already in your cart!');
    }
  };

  // Handle the payment process
  const handlePay = async () => {
    if (!account) {
      alert('Please connect to MetaMask first.');
      return;
    }

    const totalAmountUSD = cart.reduce((total, item) => total + item.price, 0);

    if (totalAmountUSD === 0) {
      alert('Your cart is empty.');
      return;
    }

    // Use the fixed ETH to USD conversion rate (2450)
    const totalAmountETH = (totalAmountUSD / fixedEthToUsdRate).toFixed(18);
    console.log(`Total amount to pay: ${totalAmountETH} ETH`);

    try {
      // Use the ethers.js Web3 provider for version 6
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Log the balance before sending the transaction
      const balance = await signer.getBalance();
      console.log('Account balance:', ethers.formatEther(balance));

      // Check if balance is enough for both the transaction and gas
      if (parseFloat(ethers.formatEther(balance)) < parseFloat(totalAmountETH)) {
        alert('Insufficient funds to complete the transaction.');
        return;
      }

      // Send the transaction
      const transaction = await signer.sendTransaction({
        to: '0x5cc5132c3d3EFC4327617743D9E537e2C8F4a9D4', // Replace with the actual address
        value: ethers.parseEther(totalAmountETH.toString()),
      });

      console.log('Transaction Hash:', transaction.hash);

      // Wait for the transaction to be confirmed
      await transaction.wait();
      alert('Payment successful!');

      // Remove purchased items from the pictures list and clear the cart
      const remainingPictures = pictures.filter(
        (picture) => !cart.includes(picture)
      );
      setPictures(remainingPictures);
      setCart([]);
    } catch (error) {
      console.error('Payment error:', error);

      // Better error handling based on error codes and messages
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Insufficient funds to complete the transaction.');
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        alert('Failed to estimate gas. Please try again.');
      } else if (error.message.includes('User denied transaction signature')) {
        alert('Transaction denied by the user.');
      } else {
        alert('Payment failed. Please check the console for more details.');
      }
    }
  };

  return (
    <div className="App">
      <h1>Buy Pictures</h1>

      <button onClick={connectWallet} className="connect-button">
        <img
          src="/images/metamask.png"
          alt="MetaMask"
          className="metamask-icon"
        />
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : 'Connect MetaMask'}
      </button>

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
