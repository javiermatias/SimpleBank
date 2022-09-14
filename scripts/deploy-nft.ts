import { ethers } from "hardhat";

async function main() {

  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", owner.address);
  const Coin = await ethers.getContractFactory("RooftopHero");
  const coin = await Coin.deploy();
  await coin.deployed();
  console.log("NFT hero:", coin.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});