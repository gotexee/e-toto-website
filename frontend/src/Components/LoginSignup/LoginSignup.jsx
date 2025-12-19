import './LoginSignup.css';
import mail_icon from '../Assets/mail.png';
import password_icon from '../Assets/padlock.png';
import logo_icon from '../Assets/logo.png';
import no_zoom from "../hooks/no_zoom.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from 'react';

const LoginSignup = () => {
    no_zoom();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError('');

        axios.post('http://localhost:8080/login', { email, password })
            .then(res => {
                console.log("Réponse backend :", res.data);
                localStorage.setItem("token", res.data.token);
                window.location.href = "/todolist";
            })
            .catch(err => {
                console.log("Erreur requête :", err);
                setError("Email ou mot de passe incorrect");
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
                    <section className="login_section">
                        <div className="login_text">Login <span className="wave-emoji">👋</span></div>
                        <div className="description_text">
                            Organisez vos journées, suivez vos tâches et restez productif avec simplicité.
                        </div>
                        <div className="description_text">
                            Connectez-vous pour accéder à votre espace personnel.
                        </div>
                    </section>

                    <section className="form_section">
                        <form onSubmit={handleSubmit}>
                            <div className="login_container">
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
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="error_message">{error}</div>}

                            <div className="forgot_password">
                                <a className="forgot_password_link" href="#">Forgot Password ?</a>
                                <Link className="create_account_link" to="/signin">Create Account</Link>
                            </div>

                            <div className="btn_container">
                                <button type="submit" className="btn" disabled={loading}>
                                    <span className="btn_text">{loading ? 'Connecting...' : 'Login'}</span>
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
}

export default LoginSignup;