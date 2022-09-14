import {useState } from "react";

function ButtonWallet({ name, stateChanger, account }) {
  const [connect, setConnect] = useState(false);
  const connectWallet = async () => {
    
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4' }], //0x1 etherum mainet, 0x2 goerli, 0x4 etherum Rinkbey
        });
      } catch {
        // We have to add the chain
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      stateChanger(accounts[0]);

    } catch (error) {
      console.log(error)
    }
  }

  if(!account){

    return (
   
      <div>
        <button className="button" onClick={connectWallet}>{name}</button>
      </div>
    );
  }


/*     return (
   
      <div>
        <button className="button" onClick={connectWallet}>Disconnect</button>
      </div>
    ); */

/*   }else{
    

  }
 */
    
  
}

export default ButtonWallet;