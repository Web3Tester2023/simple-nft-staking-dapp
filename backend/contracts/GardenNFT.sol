// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

error NotOwner();
error ContractPaused();

contract GardenNFT is ERC1155 {

    /* ========== VARIABLES ========== */

    address public owner;
    uint public mintPrice;
    uint internal treasury;
    bool public _paused;

    /* ========== MODIFIERS ========== */

    modifier onlyOwner(){
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }
    // In case of emergency sets contract on pause
    modifier onlyWhenNotPaused() {
        if(_paused){
            revert ContractPaused();
        }
        _;
    }

    constructor(uint _mintPrice) ERC1155("ipfs://bafybeicqbmxfuravq37oy4k5cc5a7yh3ajxko4smtl5ocfwf7swf7vceiy") {
        owner = msg.sender;
        mintPrice = _mintPrice;
    }

    /**
     * @param id - token ID
     * @param numberOfTokens - amount of NFTs to mint
     */
    function mint(uint256 id, uint256 numberOfTokens) public payable onlyWhenNotPaused {
        require(numberOfTokens != 0, "You need to mint at least 1 token");
        require((numberOfTokens * mintPrice) == msg.value, "Not enough Ether sent.");

        treasury += (numberOfTokens * mintPrice);

        _mint(msg.sender, id, numberOfTokens, "");
    }

    function getMintPrice () public view returns (uint256) {
        return mintPrice;
    }

    /* ========== ONLY-OWNER ========== */

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /**
     * @dev pause contract in case of emergency
     */
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    function transferOwnership (address newOwner) public onlyOwner {
        owner = newOwner;
    }

    /**
     * @dev withdraw fees from the contract
     */
    function collectFee() public onlyOwner {
        require (treasury > 0, "Treasury is empty");
        (bool success, ) = msg.sender.call{value: treasury}("");
        require(success, "Failed to withdraw");
    }

}
