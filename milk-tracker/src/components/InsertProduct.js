import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import cow from '../img/products.jpg';

export default function InsertProduct() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '2vh', marginLeft: '-300px', overflow:'hidden'}}>
      <h2 style={{ marginBottom: '30px', width: '50%', textAlign: 'center', color: "blue", marginLeft: "-475px" }}>Insert data products</h2>
      <div style={{ marginBottom: '30px', width: '50%' }}>
      <TextField label="Products Id"  variant="filled" borderColor="blue" borderRadius={10} focused  />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField label="Milk Id" variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField label="Date of production"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField label="Products type"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField label="Expiry date"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <Button variant="contained" color="primary" style={{marginLeft: "-475px"}}>Send</Button>
      <div style={{ position: 'absolute', top: 70, left: 0, width: '100vw', height: '86vh', backgroundImage: `url(${cow})`, backgroundSize: '78% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center',  opacity: '0.8', zIndex: '-1', marginLeft: "300px"}}></div>
    </div>
  );
}