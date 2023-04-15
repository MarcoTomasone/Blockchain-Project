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

    struct Product { //Should add more info about product 
        uint256 id;
        uint256 milkId;
    }

    //constructor() {
    //    owner = msg.sender;
    //}

    modifier onlyOwnerOf(uint256 _cowId) {
        require(cowToOwner[_cowId] == msg.sender, "You are not the owner of this cow");
        _;
    }

    Product[] productList;

    mapping(uint256 => address) public cowToOwner;
    mapping(address => uint256) public ownerCowCount;
    mapping(uint256 => Milk[]) public cowToMilkList;
    mapping(uint256 => Product[]) public milkToProductList;
    mapping(uint256 => uint256) public milkToCow;

    function addCow(uint256 _cowId) public {
        cowToOwner[_cowId] = msg.sender;
        ownerCowCount[msg.sender]++;
    }
    
    function addMilk(uint256 _cowId, uint256 _milkId) public onlyOwnerOf(_cowId) {
        cowToMilkList[_cowId].push(Milk(_milkId, _cowId));
    }

    function addProduct(uint256 _productId, uint256 _milkId) public onlyOwnerOf(milkToCow[_milkId]) {
        milkToProductList[_milkId].push(Product(_productId, _milkId));
    }

    function getAllProducts() public view returns(Product[] memory) {
        return productList;
    }

    function getProduct(uint256 _productId) public view returns(Product memory) {
        for(uint i=0; i < productList.length; i++) { 
            if(productList[i].id == _productId) {
                return productList[i];
            }
        }
        revert("Product not found!"); //Undo, return value, give back gas 
    }

}