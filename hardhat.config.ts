import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

// Import and configure dotenv
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  //npx hardhat run scripts/deploy-simple-bank.ts --network rinkeby
  networks: {
    rinkeby: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY as string]
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    //npx hardhat verify --network rinkeby CONTRACT_ADDRESS
    apiKey: process.env.ETHER_SCAN
  },  
  gasReporter: {
    enabled: true,
    currency: 'USD',
    coinmarketcap: 'a07c15b1-4a76-4976-b458-48944dc065d0',
    token: 'ETH',
    gasPriceApi: 'https://api.bscscan.com/api?module=proxy&action=eth_gasPrice',
    showTimeSpent: true,
  },
 
};

export default config;
