import logo from './logo.svg';
import './App.css';
import ButtonWallet from './btnWallet/button-wallet';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import contract from "./contract/SimpleBankAbi.json";
import CheckWallet from './checkWalletConnect/check-wallet';
function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [isEnroll, setIsEnroll] = useState("");
  const [balance, setBalance] = useState("");
  const contractAddress = "0x8DD130Cd016d322555f96C10861ed4d79A916337";
  const contractABI = contract.abi;

 

  const getBalance = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const simpleBankContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await simpleBankContract.getBalance();
        console.log("Retrieved balance...", count.toNumber());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error.message);
    }
  }



  return (

    <div className="App">

      <CheckWallet stateChanger={setCurrentAccount} stateEnroll={setIsEnroll} > </CheckWallet>
      {!currentAccount
        ? <ButtonWallet name="Connect Wallet" stateChanger={setCurrentAccount}></ButtonWallet>
        : <p className="address"> {currentAccount} </p>
      }


      <h2 className="title">Simple Bank</h2>

      <div className="card">

        <h1>My Balance</h1>
        <p className="balance">$0.00</p>
        {!currentAccount && (<p className="account">Connect your wallet</p>)}
        {(!isEnroll && currentAccount ) && (<p className="account">Please enroll to start</p>)}
        {!isEnroll
        ? <button>Enroll</button>
        : <><button>Deposit</button> <button>Withdraw</button> <button>WithdrawAll</button></>
        }
        
       
      </div>
    </div>
  );
}

export default App;
