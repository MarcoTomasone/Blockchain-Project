pragma solidity ^0.8.17;

contract MilkFactory {

    struct Dairy {
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
    
    uint256 public cowCount = 0;
    uint256 public milkCount = 0;
    uint256 public productCount = 0;

    Cow[] public cowList;
    Milk[] public milkList;
    Product[] public productList;

    mapping(uint256 => address) public cowToOwner;
    mapping(uint256 => uint256) public milkToCow;
    mapping(address => uint256) public ownerMilkCount;
    mapping(address => Cow[]) public ownerToCowList;
    mapping(uint256 => Milk[]) public cowToMilkList;
    mapping(uint256 => Product[]) public milkToProductList;
    //mapping(uint256 => uint256) public milkToCow;


    function addCow(uint256 _weight, string memory _breed, string memory _birthDate, string memory _residence) public {
        Cow memory myCow = Cow(cowCount, _weight, _breed, _birthDate, _residence);
        cowList.push(myCow);
        //Increase cow count that is used as id
        cowCount++;
        cowToOwner[myCow.id] = msg.sender;
        ownerToCowList[msg.sender].push(myCow);
    }
    
    function addMilk(uint256 _cowId, string memory _dateOfProduction) public onlyOwnerOf(_cowId) {
        //Check if cow exists
        Milk memory myMilk = Milk(milkCount, _cowId, _dateOfProduction);
        milkCount++;
        milkList.push(myMilk);
        cowToMilkList[_cowId].push(myMilk);
        milkToCow[myMilk.id] = _cowId;
        ownerMilkCount[msg.sender]++; 
    }
    
    function addProduct(uint256 _milkId, string memory _dateOfProduction, string memory _productType, string memory _expiryDate) public onlyOwnerOf(milkToCow[_milkId]) {
        //Check if milk exists
        Product memory  myProduct = Product( productCount, _milkId, _dateOfProduction, _productType, _expiryDate);
        productCount++;
        productList.push(myProduct);
        milkToProductList[_milkId].push(myProduct);
    }

    function getAllCows() public view returns(Cow[] memory) {
        return cowList;
    }

    function getCowsOfOwner() public view returns(Cow[] memory) {
        return ownerToCowList[msg.sender];
    }
    
    function getAllMilks() public view returns(Milk[] memory) {
        return milkList;
    }


    //TODO: Alternative to for is to create a mapping user->milk[] ?
    function getMilksOfOwner() public view returns (Milk[] memory) {
        Milk[] memory userMilkList = new Milk[](ownerMilkCount[msg.sender]-1);
        uint256 count = 0;

        for (uint256 i = 0; i < ownerToCowList[msg.sender].length; i++) {
            uint256 cowId = ownerToCowList[msg.sender][i].id;
            for (uint256 j = 0; j < cowToMilkList[cowId].length; j++) {
                userMilkList[count] = cowToMilkList[cowId][j];
                count++;
            }
        }
        return userMilkList;    
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