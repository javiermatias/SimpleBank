import {useEffect, useState } from "react";
import { ethers } from "ethers";
import contract from "../contract/SimpleBankAbi.json";

export default function CheckWallet({stateChanger, stateEnroll}){
    
    const [found, setFound] = useState(false);
    const contractAddress = "0x8DD130Cd016d322555f96C10861ed4d79A916337";
    const contractABI = contract.abi;

    const checkIfWalletIsConnected = async () => {
        try {
          const { ethereum } = window;
    
          if (!ethereum) {
            alert("Make sure you have metamask!");
            return;
          } else {
            setFound(true);
            console.log("We have the ethereum object", ethereum);
          }
    
          const accounts = await ethereum.request({ method: "eth_accounts" });
    
          if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);            
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const simpleBankContract = new ethers.Contract(contractAddress, contractABI, signer);

            const check = await simpleBankContract.getEnroll(account);
            if(check) stateEnroll(true);
            
            stateChanger(account);

            console.log("The account is ", check);
    
          } else {
            console.log("No authorized account found")
          }
        } catch (error) {
          console.log(error);
        }
      }
      useEffect(() => {
        checkIfWalletIsConnected();
      }, [])

      return (
        <div>
           {!found && <p>MetaMask not Found</p>}
          
        </div>
      );

}