
// Import - React and React Router
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginView() {

    // Enable/Disable console debug.
    const isConsoleActive = false;
    // Variable to navigate to another page.
    const navigator = useNavigate();
    // Variable to set the popup modal (show, title and body).            
    const [title, setTitle] = useState("Titolo del popup");
    const [body, setBody] = useState("Corpo del popup");

    // Function to connect to MetaMask.
    async function login() {
        if (isConsoleActive) console.log("Verifica presenza di MetaMask");
        // Check if MetaMask is installed.
        if (typeof window.ethereum === 'undefined') {
            setTitle("Errore di connessione");
            setBody("Non è stato trovato nessun provider di Ethereum. Assicurati di aver installato MetaMask.");
            //setErrorPopup(true);
            return;
        }
        // Try to connect to MetaMask.
        if (isConsoleActive) console.log("Tentativo di accesso a MetaMask");
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => {
                if (isConsoleActive) console.log("Accesso avvenuto con successo");
                // If the connection is successful, navigate to the homepage.
                navigator("/homepage");
            })
            .catch(() => {
                setTitle("Errore di connessione");
                setBody("Si è verificato un errore durante la connessione a MetaMask. Riprova più tardi.");
                //setErrorPopup(true);
            });
    }

    // Function to close the popup modal.
    const popupCloseHandler = (dataHandler) => {
        //setErrorPopup(dataHandler);
    };

    login();
    return (
        <div className="login-view">
        </div>
    );
}

export default LoginView;