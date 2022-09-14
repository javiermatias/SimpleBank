// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract RoofTop is ERC20 {
    constructor() ERC20("RoofTop", "RFT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }
}