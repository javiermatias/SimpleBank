import { ethers } from "hardhat";

async function main() {

  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", owner.address);
  const Bank = await ethers.getContractFactory("SimpleBank");
  const bank = await Bank.deploy();
  await bank.deployed();
  console.log("Simple Bank deployed to:", bank.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
