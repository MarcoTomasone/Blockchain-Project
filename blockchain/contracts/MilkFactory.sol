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

    event ProductAdded(uint256 productId);
    event SpoiledProduct(uint256 productId);
    event LogMessage(string message);
    
    Cow[] public cowList;
    Milk[] public milkList;
    Product[] public productList;

    mapping(uint256 => address) public cowToOwner;
    mapping(uint256 => uint256) public milkToCow;
    mapping(address => uint256) public ownerMilkCount;
    mapping(address => Cow[]) public ownerToCowList;
    mapping(uint256 => Milk[]) public cowToMilkList;
    mapping(uint256 => Product[]) public milkToProductList;
    mapping(address => Milk[]) public ownerToMilk;
    mapping(uint256 => bool) public spoiledProducts;
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
        ownerToMilk[msg.sender].push(myMilk);
    }
    
    function addProduct(uint256 _milkId, string memory _dateOfProduction, string memory _productType, string memory _expiryDate) public  onlyOwnerOf(milkToCow[_milkId]) {
        //Check if milk exists
        Product memory  myProduct = Product( productCount, _milkId, _dateOfProduction, _productType, _expiryDate);
        productList.push(myProduct);
        milkToProductList[_milkId].push(myProduct);
        spoiledProducts[productCount] = false;
        emit ProductAdded(productCount);
        productCount++;  
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
        return ownerToMilk[msg.sender];    
    }

    function reportSpoiledProduct(uint256 _productId) public {
        string memory message = "Hello, world!";
        emit LogMessage(message);
        spoiledProducts[_productId] = true;
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

    function isProductSpoiled(uint256 _productId) public view returns(bool) {
        return spoiledProducts[_productId];
    }

    function getMilk(uint256 _milkId) public view returns(Milk memory) {
        for(uint i=0; i < milkList.length; i++) { 
            if(milkList[i].id == _milkId) {
                return milkList[i];
            }
        }
        revert("Milk not found!"); //Undo, return value, give back gas 
    }

    function getCow(uint256 _cowId) public view returns(Cow memory) {
        for(uint i=0; i < cowList.length; i++) { 
            if(cowList[i].id == _cowId) {
                return cowList[i];
            }
        }
        revert("Cow not found!"); //Undo, return value, give back gas 
    }
}