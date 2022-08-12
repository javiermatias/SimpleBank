function ButtonWallet({ name, stateChanger }) {
 
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
          params: [{ chainId: '0x4' }],
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




  return (
    <div>
      <button className="button" onClick={connectWallet}>{name}</button>
    </div>
  );
}

export default ButtonWallet;