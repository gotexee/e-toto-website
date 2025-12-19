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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        axios.post('http://localhost:8080/signin', { email, password, name, firstname })
            .then(res => {
                console.log("Réponse backend :", res.data);
                setSuccess('Compte créé avec succès ! Redirection...');
                setEmail('');
                setPassword('');
                setName('');
                setFirstname('');
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            })
            .catch(err => {
                console.log("Erreur requête :", err);
                setError(err.response?.data?.message || "Erreur lors de la création du compte");
                setLoading(false);
            });
    }

    return (
        <div className='body'>
            <header className="header_container">
                <div className="image_container">
                    <img className="header_image" src={logo_icon} alt="Logo" />
                    <div className="line-container">
                        <hr className="line" />
                    </div>
                </div>
            </header>

            <main className="main">
                <div className='login_container_4_all'>

                    <section className="signin_section">
                        <div className="signin_text">Create Account <span className="user-emoji">👤</span></div>
                        <div className="description_text">
                            Créez votre compte pour organiser vos journées et gérer vos tâches simplement.
                        </div>
                    </section>

                    <section className="form_section">
                        <form onSubmit={handleSubmit}>
                            
                            <div className="login_container">
                                <div className="login_input_group">
                                    <img className="login_image" src={user_icon} alt="user icon" />
                                    <input
                                        className="login_input"
                                        type="text"
                                        placeholder="Nom"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="login_input_group">
                                    <img className="login_image" src={user_icon} alt="user icon" />
                                    <input
                                        className="login_input"
                                        type="text"
                                        placeholder="Prénom"
                                        value={firstname}
                                        onChange={e => setFirstname(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="login_input_group">
                                    <img className="login_image" src={mail_icon} alt="email icon" />
                                    <input
                                        className="login_input"
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="login_input_group">
                                    <img className="login_image" src={password_icon} alt="password icon" />
                                    <input
                                        className="login_input"
                                        type="password"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="error_message">{error}</div>}
                            {success && <div className="success_message">{success}</div>}

                            <div className="forgot_password">
                                <Link className="create_account_link" to="/login">Déjà un compte ? Se connecter</Link>
                            </div>

                            <div className="btn_container">
                                <button type="submit" className="btn" disabled={loading}>
                                    <span className="btn_text">{loading ? 'Création...' : 'Register'}</span>
                                    <span className="btn_arrow">→</span>
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