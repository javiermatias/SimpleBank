// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SimpleBank is ReentrancyGuard {
    //
    // State variables
    //

    /* We want to protect our users balance from other contracts */
    mapping(address => uint) private balances; //18 decimales

    //0x343  0.00015 eth -- 15000000 wei
    //0x3423

    /* We want to create a getter function and allow 
    contracts to be able to see if a user is enrolled.  */
    mapping(address => bool) enrolled;

    /* Let's make sure everyone knows who owns the bank. */
    address public owner;

    //
    // Events 
    //

    /* Add an argument for this event, an accountAddress */
    event LogEnrolled(address accountAddress);

    /* Add 2 arguments for this event, an accountAddress and an amount */
    event LogDepositMade(address accountAddress, uint256 amount);

    /* Create an event that logs Withdrawals 
    It should log 3 arguments: 
    the account address, the amount withdrawn, and the new balance. */
    // event 

    event Withdrawal(address accountAddress, uint256 amount, uint256 newBalance);


    //
    // Functions
    //

     receive() external payable {
        deposit();
    }

    constructor() {
        /* Set the owner to the creator of this contract */
        owner = msg.sender;
    }

     modifier isEnrolled() {
        require(enrolled[msg.sender], "User is not enrolled");
        _;
    }

     /// @notice Enroll a customer with the bank
    /// @return The users enrolled status
    // Emit the appropriate event
    function enroll() public returns  (bool) {
        
        require(!enrolled[msg.sender], "User already enrolled");        
        enrolled[msg.sender] = true;
        emit LogEnrolled(msg.sender);   
        return true;    
     
    }

    function getEnroll(address accountAddress) public view returns(bool) {       
        return enrolled[accountAddress];    
    }

    /// @notice Deposit ether into bank
    /// @return The balance of the user after the deposit is made
    // This function can receive ether
    // Users should be enrolled before they can make deposits
    function deposit() public payable isEnrolled returns (uint){    
        
        uint value = msg.value;
        require(value > 0, "You have to deposit more than 0");        
        balances[msg.sender] += value;
        emit LogDepositMade(msg.sender, value);
        return value;

    }

     /// @notice Get balance
    /// @return The balance of the user
    function getBalance() public isEnrolled view returns(uint)  {

        return balances[msg.sender];
    }

    /// @notice Withdraw ether from bank
    /// @param withdrawAmount amount you want to withdraw
    /// @return The balance remaining for the user
    // Emit the appropriate event
   function withdraw(uint withdrawAmount) public payable isEnrolled returns (uint) {
        
        require(balances[msg.sender] >= withdrawAmount, "You don't have enough balance");
        balances[msg.sender] -= withdrawAmount;
        (bool success, ) = msg.sender.call{value: withdrawAmount}("");
        require(success, "Failed to send Ether");
        emit Withdrawal(msg.sender, withdrawAmount, balances[msg.sender]);
        return balances[msg.sender];
    }
    

      /// @notice Withdraw remaining ether from bank
    /// @return bool transaction success
    // Emit the appropriate event
    function withdrawAll() public returns (bool) {        
        withdraw(balances[msg.sender]);
        return true;
    }

   
  



}