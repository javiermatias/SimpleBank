import { ethers } from "hardhat";

async function main() {
  //const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  //const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  //const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  //const lockedAmount = ethers.utils.parseEther("1");
  const [owner, otherAccount] = await ethers.getSigners();
  const Bank = await ethers.getContractFactory("SimpleBank");
  const bank = await Bank.deploy();

  await bank.deployed();

  console.log("Simple Bank deployed to:", bank.address);

  let message =await bank.connect(otherAccount).callStatic.enroll();
  console.log("Message enrolled",message );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
