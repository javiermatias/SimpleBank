// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Prode is ReentrancyGuard {
    //List of users
    uint countUsers;

    struct User {
        bool enter;
        bool winner;
        uint amount;
    }

    mapping(address => User) public mapUser;   
    address payable public owner;
    address payable public governance;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address payable _governance) {
        owner = payable(msg.sender);
        governance = payable(_governance);
    }

    event Withdraw(address indexed adr, uint amount);
    event Deposit(address indexed adr);

    /**
     @notice GetTotalUsers
     Know how many participants are in the game
    */
    function getTotalUsers() public view returns (uint) {
        return countUsers;
    }

    function deposit() public payable {
        require(msg.value >= 25 ether, "To enter the minimum is 25");      
        mapUser[msg.sender].enter = true;
        transfer(owner, 2.5 ether);
        transfer(governance, 2.5 ether);
        countUsers++;
        emit Deposit(msg.sender);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function userHasEnter(address user) public view returns (bool) {
        return mapUser[user].enter;
    }


    function transfer(address payable _to, uint _amount) private {
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    function pickWinner(address[] memory winner) public onlyOwner {         
        uint length = winner.length;
        uint _amount = address(this).balance / length; 
        for(uint i; i < length; i++){
            require(mapUser[winner[i]].enter, "User has to be a participant");
             mapUser[winner[i]].amount = _amount;
             mapUser[winner[i]].winner = true;
        }
    
    }

    /**
     @notice Withdraw
     Winner can withdraw his funds.
     */
    function withdraw() public nonReentrant {
        require(mapUser[msg.sender].winner, "User is not winner");
        require(
            mapUser[msg.sender].amount > 0,
            "Balance have to be more than 0"
        );
        uint _amount = mapUser[msg.sender].amount;
        mapUser[msg.sender].amount = 0;
        transfer(payable(msg.sender), _amount);
        emit Withdraw(msg.sender, _amount);
    }
}
