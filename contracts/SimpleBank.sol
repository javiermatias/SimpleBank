// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

contract SimpleBank {
    //
    // State variables
    //

    /* We want to protect our users balance from other contracts */
    mapping(address => uint) private balances;

    /* We want to create a getter function and allow 
    contracts to be able to see if a user is enrolled.  */
    mapping(address => bool) enrolled;

    /* Let's make sure everyone knows who owns the bank. */
    address public owner;

    //
    // Events 
    //

    /* Add an argument for this event, an accountAddress */
    event LogEnrolled();

    /* Add 2 arguments for this event, an accountAddress and an amount */
    event LogDepositMade();

    /* Create an event that logs Withdrawals 
    It should log 3 arguments: 
    the account address, the amount withdrawn, and the new balance. */
    // event 



    //
    // Functions
    //

    constructor() {
        /* Set the owner to the creator of this contract */
        owner = msg.sender;
    }

     /// @notice Enroll a customer with the bank
    /// @return The users enrolled status
    // Emit the appropriate event
    function enroll() public returns  (bool) {
        
        require(!enrolled[msg.sender], "User already enrolled");
        
        enrolled[msg.sender] = true;
        
        return true;
        // ...
        // 
        // 
    }

    
  



}