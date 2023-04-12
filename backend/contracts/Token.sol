// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract Token is ERC20, Ownable {
    constructor() ERC20("EY TOKEN", "EYT"){
        // _mint(msg.sender, 10000*10**decimals()); 
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}