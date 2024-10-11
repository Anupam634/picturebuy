import React, { useState, useEffect } from 'react';
import PictureItem from './components/PictureItem';
import Cart from './components/Cart';
import { ethers } from 'ethers';
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
  const [ethToUsdRate, setEthToUsdRate] = useState(null);

  // Fetch the current ETH to USD rate from the CoinGecko API
  const fetchEthToUsdRate = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const data = await response.json();
      setEthToUsdRate(data.ethereum.usd);
    } catch (error) {
      console.error('Error fetching ETH to USD rate:', error);
    }
  };

  // Run the fetchEthToUsdRate when the component mounts
  useEffect(() => {
    fetchEthToUsdRate();
  }, []);

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

    if (!ethToUsdRate) {
      alert('ETH to USD rate is unavailable. Please try again later.');
      return;
    }

    const totalAmountETH = (totalAmountUSD / ethToUsdRate).toFixed(18);
    console.log(`Total amount to pay: ${totalAmountETH} ETH`);

    try {
      // Initialize the Web3 provider using ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();

      // Send the transaction
      const transaction = await signer.sendTransaction({
        to: '0x5cc5132c3d3EFC4327617743D9E537e2C8F4a9D4',
        value: ethers.utils.parseEther(totalAmountETH.toString()),
        gasLimit: 21000, // Default gas limit for ETH transfers
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
      if (error.code === 'INSUFFICIENT_FUNDS') {
        alert('Insufficient funds to complete the transaction.');
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        alert('Failed to estimate gas. Please try again.');
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
