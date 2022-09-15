import { ethers } from "hardhat";

async function main() {

  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with account: ", owner.address);
  const Prode = await ethers.getContractFactory("SimpleBank");
  const prode = await Prode.deploy();
  await prode.deployed();
  console.log("Prode deployed to:", prode.address);
  //npx hardhat run scripts/deploy.js --network localhost
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
