import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import product from '../img/products.jpg';
import { getAccounts, addProduct} from '../utils/web3access.mjs';

export default function InsertProduct() {
  var myAccounts;
  getAccounts().then((accounts) => {
    myAccounts = accounts;
    console.log(accounts);
  });

  const TextFieldIds = ["productsId", "milkId", "dateOfProduction", "productsType", "expiryDate"];

  const sendData = () => {
    const data = {
      productId: document.getElementById("productsId").value,
      milkId: document.getElementById("milkId").value,
      dateOfProduction: document.getElementById("dateOfProduction").value,
      productsType: document.getElementById("productsType").value,
      expiryDate: document.getElementById("expiryDate").value,
    };
    var allFieldsFilled = true;
    
    TextFieldIds.forEach((id) => {
      if(data[id]=== "") {
        allFieldsFilled = false;
        document.getElementById(id).style.border = "2px solid red";
        document.getElementById(id).style.textColor = "red";
      }
    });
    
    if(allFieldsFilled) {
      TextFieldIds.forEach((id) => {
        document.getElementById(id).value = "";
        document.getElementById(id).style.border = "2px solid blue";
      });
      console.log(data);  
      addProduct(myAccounts[0], data);
    }
    else 
      alert("Please fill all the fields");
  };

  const containerStyle = {
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    width: '100%',
    height: '100%',
  };

  const productImageStyle = {
    position: 'absolute',
    top: '10%',
    right: 0,
    width: '100%',
    height: '90%',
    backgroundImage: `url(${product})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right',
    opacity: 0.99,
    zIndex: -1,
  };

  const formContainerStyle = {
    position: 'absolute',
    top: '13%',
    right: '40px',
    bottom: '1%',
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2vh',
    backgroundColor: 'white', // Aggiunge uno sfondo di colore rosso
  };


  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
      <h2 style={{ marginBottom: '30px', width: '70%', textAlign: 'center', color: "blue"}}>Insert data products</h2>
      <div style={{ marginBottom: '30px', width: '50%' }}>
      <TextField id="productsId" label="Products Id"  variant="filled" borderColor="blue" borderRadius={10} focused  />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="milkId" label="Milk Id" variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="dateOfProduction" label="Date of production"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="productsType" label="Products type"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="expiryDate" label="Expiry date"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <Button onClick={sendData} variant="contained" color="primary">Send</Button>
      </div>
      <div style={productImageStyle}></div>
    </div>
  );
}