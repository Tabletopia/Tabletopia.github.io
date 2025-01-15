// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./MyToken.sol";

contract TokenSale {
    MyToken public token;
    address public owner;
    uint256 public tokenPrice;

    event TokensPurchased(address buyer, uint256 amount, uint256 cost);

    constructor(MyToken _token, uint256 _tokenPrice) {
        token = _token;
        owner = msg.sender;
        tokenPrice = _tokenPrice;
    }

    // Function to buy tokens
    function buyTokens() public payable {
        require(msg.value > 0, "Send ETH to buy tokens");

        uint256 tokensToBuy = (msg.value * (10 ** token.decimals())) / tokenPrice;
        require(tokensToBuy > 0, "Not enough ETH sent for tokens");

        uint256 contractTokenBalance = token.balanceOf(address(this));
        require(tokensToBuy <= contractTokenBalance, "Not enough tokens available for sale");

        token.transfer(msg.sender, tokensToBuy);
        emit TokensPurchased(msg.sender, tokensToBuy, msg.value);
    }

    // Receive function to trigger buyTokens()
    receive() external payable {
        buyTokens();
    }

    // Owner can withdraw collected ETH
    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }
}