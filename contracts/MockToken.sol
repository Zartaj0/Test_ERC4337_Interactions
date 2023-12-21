// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("AccountAbstraction", "AA") {}

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount * 10 ** decimals());
    }
}
