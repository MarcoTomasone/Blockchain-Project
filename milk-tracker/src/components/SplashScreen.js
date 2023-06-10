import { useNavigate } from 'react-router-dom';

function SplashScreen() {
    const navigate = useNavigate()
    
    const loadLogin = () => {   
        navigate('/login');
    }

    setTimeout(loadLogin, 3000);
    return(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',  marginTop: '-70px' }}>
        <img
          className="logo-image"
          src={require("../img/mozzarellaLogo-removebg-preview.png")}
          alt="Mozzarella Logo"
          style={{ width: '400px', animation: 'spin 3s infinite linear' }} // Imposta la larghezza desiderata per l'immagine e l'animazione di rotazione
      />
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
    );
    
}

export default SplashScreen;