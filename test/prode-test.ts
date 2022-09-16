import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Prode", function () {
    const ONE_HUNDRED = ethers.utils.parseEther("1005");
    const TWENTY_MATIC = ethers.utils.parseEther("20");
    const TWENTY_FIVE_MATIC = ethers.utils.parseEther("25");
    const FEE = ethers.utils.parseEther("2.5");
    /* const ONE_LPTOKEN = ethers.utils.parseEther("1.0");
    const HALF_LPTOKEN = ethers.utils.parseEther("0.5");
    const TEN_LPTOKEN = ethers.utils.parseEther("10");
    const FIFTY_LPTOKEN = ethers.utils.parseEther("50");
    const TOTAL_DAPPTOKEN = ethers.utils.parseEther("3500000");
    const EIGHT_DAPPTOKEN = ethers.utils.parseEther("8.666666666666666666");
    const FORTY_TWO_DAPPTOKEN = ethers.utils.parseEther("42.5"); */
  
    async function deployProdeFarm() {
  
      // Contracts are deployed using the first signer/account by default
      const [owner, governance, player1, player2, player4, player5,player6] = await ethers.getSigners();
  
      const ProdeFarm = await ethers.getContractFactory("Prode");  
      const prodeFarm  = await ProdeFarm.deploy(governance.address);
      await prodeFarm.deployed();   
  
      return { prodeFarm, owner, governance, player1, player2, player4, player5,player6};
    }

    describe("Deployment", function () {
        it("Should deploy the contract", async function () {
          const { prodeFarm} = await loadFixture(deployProdeFarm);
          expect(prodeFarm).to.not.empty;
        });
      
      });

    describe("Deposit", function () {
        it("Should revert if user deposit less than amount", async function () {
          const {prodeFarm,player1} = await loadFixture(deployProdeFarm);
          await expect(prodeFarm.connect(player1).deposit({from: player1.address, value: TWENTY_MATIC})).to.be.revertedWith('To enter the minimum is 25');
        });
        it("Should Balance have to be update", async function () {
            const {prodeFarm,player1} = await loadFixture(deployProdeFarm);
            await prodeFarm.connect(player1).deposit({from: player1.address, value:TWENTY_FIVE_MATIC});
            expect(await prodeFarm.getBalance()).to.be.equal(TWENTY_MATIC);
          });
      
          it("Should send FEEs", async function () {
            const {prodeFarm, player1,player2,owner, governance} = await loadFixture(deployProdeFarm);
            await prodeFarm.connect(player1).deposit({from: player1.address, value: TWENTY_FIVE_MATIC});
            await prodeFarm.connect(player2).deposit({from: player2.address, value: TWENTY_FIVE_MATIC});
            const balanceGovernance = await prodeFarm.provider.getBalance(governance.address);
      
           
            expect(balanceGovernance).to.be.equal(ONE_HUNDRED);
          });
      })
  
   /*  describe("Deployment", function () {
      it("Should deploy the contract", async function () {
        const { tokenFarm } = await loadFixture(deployTokenFarm);
        expect(tokenFarm).to.not.empty;
      });
      it("Should have 3500000 DappToken of balance", async function () {
        const { tokenFarm, dappToken } = await loadFixture(deployTokenFarm);
        expect(await dappToken.balanceOf(tokenFarm.address)).to.be.equal(TOTAL_DAPPTOKEN);
      });
    });
  
    describe("Deposit", function () {
      it("Should revert if user deposit Zero", async function () {
        const { tokenFarm } = await loadFixture(deployTokenFarm);
        await expect(tokenFarm.deposit(0)).to.be.revertedWith('Amount must be greater than 0');
      });
      it("Should revert if user have not allowance", async function () {
        const { tokenFarm } = await loadFixture(deployTokenFarm);
        await expect(tokenFarm.deposit(ONE_LPTOKEN)).to.be.revertedWith('ERC20: insufficient allowance');
      });
      it("Should revert if user approve but want to deposit more than his approve amount", async function () {
        const { lpToken, tokenFarm } = await loadFixture(deployTokenFarm);
        lpToken.approve(tokenFarm.address, HALF_LPTOKEN);
        await expect(tokenFarm.deposit(ONE_LPTOKEN)).to.be.revertedWith('ERC20: insufficient allowance');
      });
  
      it("Should Mint LP Tokens for a user and make a deposit of those tokens", async function () {
        const { lpToken, tokenFarm, owner, otherAccount } = await loadFixture(deployTokenFarm);
        await lpToken.transfer(otherAccount.address, FIFTY_LPTOKEN); //Mint tokens 
        await lpToken.connect(otherAccount).approve(tokenFarm.address, FIFTY_LPTOKEN);//approve            
        await tokenFarm.connect(otherAccount).deposit(FIFTY_LPTOKEN); //Deposit 
        expect((await tokenFarm.connect(otherAccount).users(otherAccount.address)).isStaking).to.be.true;
      });
      it("Should user deposit update total staked", async function () {
        const { lpToken, tokenFarm } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, ONE_LPTOKEN);
        await tokenFarm.deposit(ONE_LPTOKEN);
        expect(await tokenFarm.totalStaked()).to.be.equal(ONE_LPTOKEN);
      });
      it("Should user deposit update his balance", async function () {
        const { lpToken, tokenFarm, owner } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, ONE_LPTOKEN);
        await tokenFarm.deposit(ONE_LPTOKEN);
        expect((await tokenFarm.users(owner.address)).balance).to.be.equal(ONE_LPTOKEN);
      });
  
      it("Should emit an event on Deposit", async function () {
        const { owner, lpToken, tokenFarm } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, ONE_LPTOKEN);
        await expect(tokenFarm.deposit(ONE_LPTOKEN))
          .to.emit(tokenFarm, "Stake")
          .withArgs(owner.address, ONE_LPTOKEN);
      });
  
  
    });
    //The platform correctly distributes rewards to all staking users
    describe("Rewards", function () {
      it("The platform Should correctly distributes rewards to all staking users", async function () {
        const { lpToken, tokenFarm, owner, otherAccount } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, TEN_LPTOKEN);
        await lpToken.transfer(otherAccount.address, FIFTY_LPTOKEN);
        await lpToken.connect(otherAccount).approve(tokenFarm.address, FIFTY_LPTOKEN);
        await tokenFarm.deposit(TEN_LPTOKEN);//Block 8      
        await tokenFarm.connect(otherAccount).deposit(FIFTY_LPTOKEN); //Block 9      
        await ethers.provider.send("hardhat_mine", ["0x32"]); //50 blocks mined
        await tokenFarm.distributeRewardsAll(); //after this block 60   
        await expect((await tokenFarm.users(owner.address)).pendingRewards).to.be.equal(EIGHT_DAPPTOKEN);
        await expect((await tokenFarm.users(otherAccount.address)).pendingRewards).to.be.equal(FORTY_TWO_DAPPTOKEN);
  
      });
      it("User claim rewards and should be transferred to his account", async function () {
        const { lpToken, dappToken, tokenFarm, owner, otherAccount } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, TEN_LPTOKEN);
        await lpToken.transfer(otherAccount.address, FIFTY_LPTOKEN);
        await lpToken.connect(otherAccount).approve(tokenFarm.address, FIFTY_LPTOKEN);
        await tokenFarm.deposit(TEN_LPTOKEN);//Block 8      
        await tokenFarm.connect(otherAccount).deposit(FIFTY_LPTOKEN); //Block 9      
        await ethers.provider.send("hardhat_mine", ["0x32"]); //50 blocks mined     
        await tokenFarm.claimRewards();
        await expect((await tokenFarm.users(owner.address)).pendingRewards).to.be.equal(0);
        await expect(await dappToken.balanceOf(owner.address)).to.be.equal(EIGHT_DAPPTOKEN);
  
      });
      it("Should get total of rewards distributed", async function () {
        const { lpToken, tokenFarm, owner, otherAccount } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, TEN_LPTOKEN);
        await lpToken.transfer(otherAccount.address, FIFTY_LPTOKEN);
        await lpToken.connect(otherAccount).approve(tokenFarm.address, FIFTY_LPTOKEN);
        await tokenFarm.deposit(TEN_LPTOKEN);//Block 8      
        await tokenFarm.connect(otherAccount).deposit(FIFTY_LPTOKEN); //Block 9      
        await ethers.provider.send("hardhat_mine", ["0x32"]); //50 blocks mined          
        await expect(await tokenFarm.callStatic.distributeRewardsAll()).to.be.equal(ethers.utils.parseEther("50.166666666666666666")); //42.5 + 8.66   
      });
      it("Owner should withdraw the fee and be transfered to his account", async function () {
        const { lpToken, tokenFarm, owner, otherAccount } = await loadFixture(deployTokenFarm);
        await lpToken.transfer(otherAccount.address, FIFTY_LPTOKEN);
        await lpToken.connect(otherAccount).approve(tokenFarm.address, FIFTY_LPTOKEN);
        await tokenFarm.connect(otherAccount).deposit(FIFTY_LPTOKEN); //Block 9      
        await ethers.provider.send("hardhat_mine", ["0x32"]); //50 blocks mined
        await tokenFarm.distributeRewardsAll(); //after this block 60   
        await tokenFarm.connect(otherAccount).claimRewards();
        await tokenFarm.withdrawFee();
        //This number is total of LP tokens of the owner - Fifty Lptokens(transfer otherAccount) + 2 fee      
        let amount = ethers.utils.parseEther("149952"); //15000 - 50 + 2
        await expect(await lpToken.connect(owner).balanceOf(owner.address)).to.be.equal(amount);
  
      });
      it("Should change block rewards between a range", async function () {
        const { tokenFarm } = await loadFixture(deployTokenFarm);
        await tokenFarm.setRewardPerBlock(3);
        await expect(await tokenFarm.REWARD_PER_BLOCK()).to.be.equal(3);
      });
    });
  
  
    describe("Withdraw", function () {
      it("Should revert if user is not staking", async function () {
        const { tokenFarm } = await loadFixture(deployTokenFarm);
        await expect(tokenFarm.withdrawAll()).to.be.revertedWith('Amount must be greater than 0');
      });
      it("Should revert if user want to withdraw more than his balance", async function () {
        const { lpToken, tokenFarm } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, ONE_LPTOKEN);
        await tokenFarm.deposit(ONE_LPTOKEN);
        await expect(tokenFarm.withdraw(TEN_LPTOKEN)).to.be.revertedWith('Balance must be greater or equal than amount');
      });
      it("WithdrawAll user balance should update to ZERO", async function () {
        const { owner, lpToken, tokenFarm } = await loadFixture(deployTokenFarm);
        await lpToken.approve(tokenFarm.address, ONE_LPTOKEN);
        await tokenFarm.deposit(ONE_LPTOKEN);
        await tokenFarm.withdrawAll();
        expect((await tokenFarm.users(owner.address)).balance).to.be.equal(0);
        expect((await tokenFarm.users(owner.address)).isStaking).to.be.false;
      });
      it("WithdrawAll should transfer his tokens", async function () {
        const { otherAccount, lpToken, tokenFarm } = await loadFixture(deployTokenFarm);
        await lpToken.transfer(otherAccount.address, ONE_LPTOKEN);
        await lpToken.connect(otherAccount).approve(tokenFarm.address, ONE_LPTOKEN);
        await tokenFarm.connect(otherAccount).deposit(ONE_LPTOKEN);
        await tokenFarm.connect(otherAccount).withdrawAll();
        await expect(await lpToken.connect(otherAccount).balanceOf(otherAccount.address)).to.be.equal(ONE_LPTOKEN);
      });
    });
   */

  
  });