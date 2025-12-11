import './SignIn.css' 
import mail_icon from '../Assets/mail.png';
import password_icon from '../Assets/padlock.png';
import user_icon from '../Assets/user.png';
import logo_icon from '../Assets/logo.png';
import no_zoom from "../hooks/no_zoom.jsx";
import axios from "axios"; 
import { Link } from "react-router-dom"; 
import { useState } from "react"; 

const SignIn = () => {
    
    no_zoom();

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [firstname, setFirstname] = useState('');


    function handleSubmit(event) {
        event.preventDefault();
        console.log("handleSubmit_signin exécuté !");

        axios.post('http://localhost:8080/signin', { email, password, name, firstname })
            .then(res => {
                console.log("Réponse backend :", res.data);
                window.location.href = "/login";
            })
            .catch(err => {
                console.log("Erreur requête :", err);
            });
    }

    return (
        <div className='body'>

            
            <header className="header_container">
                <div className="image_container">
                    <img className="header_image" src={logo_icon} alt="" />
                    <div className="line-container">
                        <hr className="line" />
                    </div>
                </div>
            </header>

            
            <main className="main">
                <div className='login_container_4_all'>

                    <section>
                        <div className="signin_text">Create Account👤</div>
                        <div className="description_text">
                            Créez votre compte pour organiser vos journées et gérer vos tâches simplement.
                        </div>
                    </section>

                    <section>
                        <form onSubmit={handleSubmit}>
                            
                            <div className="login_container">

    <div className="login_group">
        <img className="login_image" src={user_icon} alt="user icon" />
        <input
            className="login_input"
            type="text"
            placeholder="Nom"
            onChange={e => setName(e.target.value)}
            required
        />
    </div>

    <div className="login_group">
        <img className="login_image" src={user_icon} alt="user icon" />
        <input
            className="login_input"
            type="text"
            placeholder="Prénom"
            onChange={e => setFirstname(e.target.value)}
            required
        />
    </div>

    <div className="login_group">
        <img className="login_image" src={mail_icon} alt="email icon" />
        <input
            className="login_input"
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            required
        />
    </div>

    <div className="login_group">
        <img className="login_image" src={password_icon} alt="password icon" />
        <input
            className="login_input"
            type="password"
            placeholder="Mot de passe"
            onChange={e => setPassword(e.target.value)}
            required
        />
    </div>

</div>

                            <div className="forgot_password">
                                <Link className="create_account_link" to="/login">Login</Link>
                            </div>

                            <div className="btn_container">
                                <button type="submit" className="btn magnetic">
                                    <span>Register</span>
                                    <div className="particles-field" id="particleField"></div>
                                </button>
                            </div>

                        </form>
                    </section>

                </div>

                <div className="footer_container">
                    <footer>
                        <div className="credit_container">
                            <p>Made by : Gautier, Pierre, Thersan</p>
                        </div>
                    </footer>
                </div>

            </main>
        </div>
    );
};

export default SignIn;
