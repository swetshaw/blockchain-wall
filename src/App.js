import './App.css';
import React from 'react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from './utils/WallOfLove.json';

function App() {
  const [allMsgs, setAllMsgs] = useState([]);
  const [message, setMessage] = useState('');
  const [currentAccount, setCurrentAccount] = useState('');

  const contractAddress = '0x1e67633A7Fa53b153Bad7677e900eb9DcD0702E3';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('No wallet detected! Please install metamask');
        return;
      } else {
        console.log('We have the ethereum object');
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(`Found an authorized account: ${account}`);
        setCurrentAccount(account);
      } else {
        alert('Connect your metamask wallet');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAllMessages = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const wallOfLoveContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const messages = await wallOfLoveContract.getAllMessages();
        let messagesCleaned = [];
        messages.forEach((msg) => {
          messagesCleaned.push({
            address: msg.sender,
            timestamp: new Date(msg.timestamp * 1000),
            message: msg.message,
          });
        });
        setAllMsgs(messagesCleaned);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('No wallet found. Please install metamsk!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log(`Connected to ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const wallOfLoveContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const msgTxn = await wallOfLoveContract.sendMessage(message);
        console.log(`Mining... ${msgTxn.hash}`);

        await msgTxn.wait();
        console.log(`Mined.. ${msgTxn.hash}`);

        const messages = await wallOfLoveContract.getAllMessages();

        let messagesCleaned = [];
        messages.forEach((msg) => {
          messagesCleaned.push({
            address: msg.sender,
            timestamp: new Date(msg.timestamp * 1000),
            message: msg.message,
          });
        });
        setAllMsgs(messagesCleaned);
        setMessage('');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onInputChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllMessages();
  }, [currentAccount]);

  return (
    <div className='mainContainer'>
      <div className='dataContainer'>
        <div className='header'>
          <div className='heading'>
            {' '}
            <span className='emoji'>💖 </span>Eternal Wall of Love 💖{' '}
          </div>
          <div className='subheading'>Write a message for your love or just drop a heart ♥️.</div>
          <div className='subtitle'>
            Remember..this message goes to the blockchain and stays there till
            eternity 🌈
          </div>
          {currentAccount ? (
            <>
              <div className='inputMessage'>
                <input
                  className='inputBox'
                  placeholder='Write your message'
                  type='text'
                  value={message}
                  onChange={onInputChange}
                ></input>
              </div>
              <div className='submitButton'>
                <button className='submitBtn' onClick={sendMessage}>
                  Engrave my Message
                </button>
              </div>{' '}
            </>
          ) : (
            <div className='submitButton'>
              <button className='submitBtn' onClick={connectWallet}>
                Connect my wallet
              </button>
            </div>
          )}
        </div>
      </div>
      <div className='displayMessageSection'>
        {allMsgs
          .slice(0)
          .reverse()
          .map((msg, index) => {
            return (
              <div className='msgCard' key={index}>
                <div className='msgCardContent'>
                  <div className='message'>{msg.message}</div>
                  <div className='timestamp'>{msg.timestamp.toString()}</div>
                  <div className='sender'>{msg.address}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
