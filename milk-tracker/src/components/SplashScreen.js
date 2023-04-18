import { useNavigate } from 'react-router-dom';

function SplashScreen() {
    const navigate = useNavigate()
    
    const loadLogin = () => {   
        navigate('/login');
    }

    setTimeout(loadLogin, 3000);
    return(
        <img className="logo-image" src={require("../img/mozzarellaLogo-removebg-preview.png")} alt={"Mozzarella Logo"}/>
    );
    
}

export default SplashScreen;