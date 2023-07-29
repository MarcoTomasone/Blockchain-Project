pragma solidity ^0.8.17;

contract MilkTracker {

    struct Dairy {
        address dairyAddress;
        string dairyName;
        string dairyPlace;
    }

    struct Cow {
        uint256 id;
        uint16 weight;
        string breed;
        string birthDate;
        string residence;
    }

    struct Milk {
        uint256 id;
        uint256 cowId;
        string dateOfProduction;
    }

    struct Product { 
        uint256 id;
        uint256 milkId;
        string dateOfProduction;
        string productType;
        string expiryDate;
    }

    
    modifier onlyOwnerOfCow(uint256 _cowId) {
        require(cowToOwner[_cowId] == msg.sender, "You are not the owner of this cow");
        _;
    }

     modifier onlyOwnerOfMilk(uint256 _milkId) {
        require(milkToOwner[_milkId] == msg.sender, "You are not the owner of this milk");
        _;
    }

    event ProductAdded(uint256 productId);
    event SpoiledProduct(uint256 productId);
    
    Dairy[] public dairyList;
    Cow[] public cowList;
    Milk[] public milkList;
    Product[] public productList;

    mapping(uint256 => address) public cowToOwner;
    mapping(uint256 => address) public milkToOwner; 
    mapping(address => Cow[]) public ownerToCowList;
    mapping(address => Milk[]) public ownerToMilk;
    mapping(uint256 => bool) public spoiledMilks;
    mapping(uint256 => bool) public deathCows;
   
   
    function addDairy(string memory _dairyName, string memory _dairyPlace) public {
        Dairy memory myDairy = Dairy(msg.sender, _dairyName, _dairyPlace);
        dairyList.push(myDairy);
    }

    function checkDairyIsRegistered() public view returns (bool) {
        for(uint i=0; i < dairyList.length; i++) { 
            if(dairyList[i].dairyAddress == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function getAllDairyExceptSelf() public view returns (Dairy[] memory) {
        Dairy[] memory result = new Dairy[](dairyList.length - 1);
        uint256 resultIndex = 0;
        for (uint256 i = 0; i < dairyList.length; i++) {
            if (dairyList[i].dairyAddress != msg.sender) {
                result[resultIndex] = dairyList[i];
                resultIndex++;
            }
        }
        return result;
    }

    function transferCow(uint256 _cowId, address _newOwner) public onlyOwnerOfCow(_cowId) {
        require(_newOwner != address(0), "Invalid new owner address");
        //Delete cow from old owner mapping 
        for(uint i=0; i < ownerToCowList[msg.sender].length; i++) { 
            if(ownerToCowList[msg.sender][i].id == _cowId) {
                ownerToCowList[msg.sender][i] = ownerToCowList[msg.sender][(ownerToCowList[msg.sender].length-1)];
            }
        }
        ownerToCowList[msg.sender].pop();
        //Add cow to new owner mapping
        ownerToCowList[_newOwner].push(getCow(_cowId));
        cowToOwner[_cowId] = _newOwner;
    }

    function transferMilk(uint256 _milkId, address _newOwner) public onlyOwnerOfMilk(_milkId) {
        require(_newOwner != address(0), "Invalid new owner address");
        
        //Delete milk from old owner mapping 
        for(uint i=0; i < ownerToMilk[msg.sender].length; i++) { 
            if(ownerToMilk[msg.sender][i].id == _milkId) {
                ownerToMilk[msg.sender][i] = ownerToMilk[msg.sender][(ownerToMilk[msg.sender].length-1)];
            }
        }
        ownerToMilk[msg.sender].pop();
        //Add milk to new owner mapping
        ownerToMilk[_newOwner].push(getMilk(_milkId));
        milkToOwner[_milkId] = _newOwner;
    }


    function addCow(uint16 _weight, string memory _breed, string memory _birthDate, string memory _residence) public {
        Cow memory myCow = Cow(cowList.length, _weight, _breed, _birthDate, _residence);
        cowList.push(myCow);
        //Increase cow count that is used as id
        cowToOwner[myCow.id] = msg.sender;
        ownerToCowList[msg.sender].push(myCow);
    }
    
    function addMilk(uint256 _cowId, string memory _dateOfProduction) public onlyOwnerOfCow(_cowId) {
        //Check if cow exists
        Milk memory myMilk = Milk(milkList.length, _cowId, _dateOfProduction);
        spoiledMilks[milkList.length] = false;
        milkList.push(myMilk);
        ownerToMilk[msg.sender].push(myMilk);
        milkToOwner[myMilk.id] = msg.sender;
    }
    
    function addProduct(uint256 _milkId, string memory _dateOfProduction, string memory _productType, string memory _expiryDate) public  onlyOwnerOfMilk(_milkId) {
        //Check if milk exists
        Product memory  myProduct = Product( productList.length, _milkId, _dateOfProduction, _productType, _expiryDate);
        emit ProductAdded(productList.length); 
        productList.push(myProduct);
    }

    function killCow(uint256 _cowId) public onlyOwnerOfCow(_cowId) {
        deathCows[_cowId] = true;
    }

    function getAllCows() public view returns(Cow[] memory) {
        return cowList;
    }

    function getCowsOfOwner() public view returns(Cow[] memory) {
        return ownerToCowList[msg.sender];
    }

    function getAliveCowsOfOwner() public view returns(Cow[] memory) {
        Cow[] memory cows = ownerToCowList[msg.sender];
        uint256 aliveCows = 0;
        for(uint i=0; i < cows.length; i++) { 
            if(deathCows[cows[i].id] == false) {
                aliveCows++;
            }
        }
        Cow[] memory aliveCowList = new Cow[](aliveCows);
        uint256 index = 0;
        for(uint i=0; i < cows.length; i++) { 
            if(deathCows[cows[i].id] == false) {
                aliveCowList[index] = cows[i];
                index++;
            }
        }
        return aliveCowList;
    }
    
    function getAllMilks() public view returns(Milk[] memory) {
        return milkList;
    }

    function getMilksOfOwner() public view returns (Milk[] memory) {
        return ownerToMilk[msg.sender];    
    }

    function reportSpoiledProduct(uint256 _productId) public {
        uint256 milkId = getProduct(_productId).milkId;
        spoiledMilks[milkId] = true;
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

    function isMilkSpoiled(uint256 _milkId) public view returns(bool) {
        return spoiledMilks[_milkId];
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