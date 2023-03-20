pragma solidity ^0.8.17;

contract MilkFactory {

    struct Daisy {
        uint256 id;
    }

    struct Cow {
        uint256 id;
    }

    struct Milk {
        uint256 id;
        uint256 cowId;
    }

    struct Product {
        uint256 id;
        uint256 milkId;
    }

    modifier onlyOwnerOf(uint256 _cowId) {
        require(cowToOwner[_cowId] == msg.sender, "You are not the owner of this cow");
        _;
    }

    mapping(uint256 => address) public cowToOwner;
    mapping(address => uint256) public ownerCowCount;
    mapping(uint256 => Milk[]) public cowToMilkList;
    mapping(uint256 => Product[]) public milkToProductList;

    function addCow(uint256 _cowId) public {
        cowToOwner[_cowId] = msg.sender;
        ownerCowCount[msg.sender]++;
    }
    
    function addMilk(uint256 _cowId, uint256 _milkId) public onlyOwnerOf(_cowId) {
        cowToMilkList[_cowId].push(Milk(_milkId, _cowId));
    }

}