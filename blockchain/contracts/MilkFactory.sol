pragma solidity ^0.8.17;

contract MilkFactory {

    struct Daisy {
        address dairyAddress;
        string dairyName;
        string dairyPlace;
    }

    struct Cow {
        uint256 id;
        uint256 weight;
        string breed;
        string birthDate;
        string residence;
    }

    struct Milk {
        uint256 id;
        uint256 cowId;
        string dateOfProduction;
    }

    struct Product { //Should add more info about product 
        uint256 id;
        uint256 milkId;
        string dateOfProduction;
        string productType;
        string expiryDate;
    }

    //constructor() {
    //    owner = msg.sender;
    //}

    modifier onlyOwnerOf(uint256 _cowId) {
        require(cowToOwner[_cowId] == msg.sender, "You are not the owner of this cow");
        _;
    }
    Cow[] public cowList;
    Product[] public productList;

    mapping(uint256 => address) public cowToOwner;
    mapping(address => uint256) public ownerCowCount;
    mapping(uint256 => Milk[]) public cowToMilkList;
    mapping(uint256 => Product[]) public milkToProductList;
    mapping(uint256 => uint256) public milkToCow;

    function addCow(uint256 _cowId, uint256 _weight, string memory _breed, string memory _birthDate, string memory _residence) public {
        Cow memory myCow = Cow(_cowId, _weight, _breed, _birthDate, _residence);
        cowList.push(myCow);
        cowToOwner[_cowId] = msg.sender;
        ownerCowCount[msg.sender]++;
    }
    
    function addMilk(uint256 _cowId, uint256 _milkId, string memory _dateOfProduction) public onlyOwnerOf(_cowId) {
        Milk memory myMilk = Milk(_milkId, _cowId, _dateOfProduction);
        cowToMilkList[_cowId].push(myMilk);
        milkToCow[_milkId] = _cowId;
    }

    function addProduct(uint256 _productId, uint256 _milkId, string memory _dateOfProduction, string memory _productType, string memory _expiryDate) public onlyOwnerOf(milkToCow[_milkId]) {
        Product memory  myProduct = Product(_productId, _milkId, _dateOfProduction, _productType, _expiryDate);
        milkToProductList[_milkId].push(myProduct);
        productList.push(myProduct);
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