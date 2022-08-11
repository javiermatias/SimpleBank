import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",  
  gasReporter: {
    enabled: true,
    currency: 'USD',
    coinmarketcap: 'a07c15b1-4a76-4976-b458-48944dc065d0',
    token: 'ETH',
    gasPriceApi: 'https://api.bscscan.com/api?module=proxy&action=eth_gasPrice',
    showTimeSpent: true,
  },
  networks: {
    rinkeby: {
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};

export default config;
