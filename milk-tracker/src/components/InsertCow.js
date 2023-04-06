import TextField from  '@mui/material/TextField';
import Button from '@mui/material/Button';
import cow from '../img/cow.png';


export default function InsertCow() {

  const TextFieldIds = ["cowId", "cowBreed", "cowBirth", "cowResidence", "cowWeight"];

  const sendData = () => {
    const data = {
      cowId: document.getElementById("cowId").value,
      cowBreed: document.getElementById("cowBreed").value,
      cowBirth: document.getElementById("cowBirth").value,
      cowResidence: document.getElementById("cowResidence").value,
      cowWeight: document.getElementById("cowWeight").value,
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
      console.log(data);  //TODO: pass data to the Blockchain 
    }
    else 
      alert("Please fill all the fields");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', paddingTop: '2vh', marginLeft: '-300px', overflow:'hidden'}}>
      <h2 style={{ marginBottom: '30px', width: '50%', textAlign: 'center', color: "blue", marginLeft: "-475px" }}>Insert data cow</h2>
      <div style={{ marginBottom: '30px', width: '50%' }}>
      <TextField id="cowId"  label="Cow Id"  variant="filled" borderColor="blue" borderRadius={10} focused  />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="cowBreed" label="Cow Breed" variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="cowBirth" label="Cow Birth"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="cowResidence" label="Cow Residence"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <div style={{ marginBottom: '30px', width: '50%' }}>
        <TextField id="cowWeight" label="Cow Weight"  variant="filled" borderColor="blue" borderRadius={10} focused />
      </div>
      <Button onClick={sendData} variant="contained" color="primary" style={{marginLeft: "-475px"}}>Send</Button>
      <div style={{ position: 'absolute', top: 70, left: 0, width: '100vw', height: '86vh', backgroundImage: `url(${cow})`, backgroundSize: '78% 100%', backgroundRepeat: 'no-repeat', backgroundPosition: 'left center',  opacity: '0.8', zIndex: '-1', marginLeft: "300px"}}></div>
    </div>
  );
}



