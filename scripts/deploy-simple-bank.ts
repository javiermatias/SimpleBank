import { ethers } from "hardhat";

async function main() {

  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", owner.address);
  const Bank = await ethers.getContractFactory("Prode");
  const bank = await Bank.deploy("0x6629CE0e3B3C60cD9037AE891bACB0A8F39447CE");
  await bank.deployed();
  console.log("Simple Bank deployed to:", bank.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
