// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    // Variables
    // address payable public immutable feeAccount; // the account that receives fees
    uint public itemCount;
    // IERC20 private token;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }

    struct ItemHistory {
        address owner;
        string userAction; // Buy, List, ReList
    }

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    mapping(uint => ItemHistory[]) public itemOwnershipHistory;

    mapping(uint => Item) public items;

    constructor() {}

    // Make item to offer on the marketplace
    function makeItem(
        IERC721 _nft,
        uint _tokenId,
        uint _price
    ) external nonReentrant {
        require(_price >0, "Price must be greater than zero");
        // increment item count
        itemCount++;

        //transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        // add new item to  items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        itemOwnershipHistory[_tokenId].push(ItemHistory(msg.sender, "List"));

        // emit offered event
        emit Offered (itemCount, address(_nft), _tokenId, _price, msg.sender);
    }


    function buyNFT(uint _itemId, uint _tokenId) external payable nonReentrant {
      Item storage item =items[_itemId];
      require(_itemId>0 && _itemId<= itemCount, "item doesn't exist");

      // update item to sold
      item.sold=true;
      // transfer nft to buyer
      item.nft.transferFrom(address(this), msg.sender, item.tokenId);

      // pushing new owner inside mappings
      itemOwnershipHistory[_tokenId].push(ItemHistory(msg.sender, "Buy"));

      // emit biught event
      emit Bought(
        _itemId,
        address(item.nft),
        item.tokenId,
        item.price,
        item.seller,
        msg.sender
      );

    }


    function getItemOwnerHistory(uint _itemId) public view returns (ItemHistory[] memory) {
      return itemOwnershipHistory[_itemId];
    }

    function getTotalPrice(uint _itemId) public view returns(uint){
      return((items[_itemId].price*(100))/100);
      
    }


}
