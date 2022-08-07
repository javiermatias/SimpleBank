import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
describe("Bank", function () {
    
    async function deployFixture() {
        
        const [owner, otherAccount] = await ethers.getSigners();
        const Bank = await ethers.getContractFactory("SimpleBank");
        const bank = await Bank.deploy();  
        await bank.deployed();       
  
        return { bank,owner, otherAccount };
    }

    describe("Tests", function() {
        
        it("Should Enroll user and check if its correctly mark enrolled", async function () {
            const { bank, otherAccount } = await loadFixture(deployFixture);     
          
            await expect(await bank.connect(otherAccount).callStatic.enroll()).to.be.true;

             
        });
    
    
     });
    

 });


 /**
  * The return-value of a non-constant (neither pure nor view) function is available only when the function is called on-chain (i.e., from this contract or from another contract).

When you call such function from the off-chain (e.g., from an ethers.js script), you need to execute it within a transaction, and the return-value is the hash of that transaction.

This is because it is unknown when the transaction will be mined and added to the blockchain.

Moreover, even when the transaction is added to the blockchain, it can be removed from it later.

The longer it stays on the blockchain, the smaller the chances are that it will be removed from it later in the future.

It is custom to confirm 12 blocks before assuming that it will remain in the blockchain forever.

In order to obtain the return-value of a non-constant function when you call it from the off-chain, you can emit an event which contains the value which you are about to return.

The contents of this event will then be available to you within the transaction receipt, which you may obtain via the transaction hash.
  */

