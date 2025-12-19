import './Homepage.css';
import logo from '../Assets/logo.png';
import { Link } from "react-router-dom";

const HomePage = () => {
  return(
    <div className="welcome_1div">
      <div className="hero-section">
        <div className="logo-container">
          <img src={logo} alt="PGT logo" className="welcome-logo" />
          <hr className="welcome-divider" />
        </div>

        <h1 className="welcome-title">
          WELCOME <span className="wave-emoji" role="img" aria-label="wave">👐</span>
        </h1>

        <p className="welcome-text">
          Gérez vos tâches, fixez vos priorités et suivez vos progrès facilement.<br />
          Organisez votre journée et restez productif en un clin d'œil !
        </p>

        <p className="welcome-subtext">
          <strong>PGT</strong>, votre compagnon de tous les jours.<br />
          Démarrez votre expérience ici.
        </p>

        <Link to="/login" className="button-link">
          <button className="commencer_button">
            <span className="button-text">Commencer</span>
            <span className="button-arrow">→</span>
          </button>
        </Link>

        <div className="features-preview">
          <div className="feature-card">
            <span className="feature-icon">📋</span>
            <h3>Gérez vos tâches</h3>
            <p>Créez et organisez vos tâches facilement</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Suivez vos progrès</h3>
            <p>Visualisez votre progression en temps réel</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Fixez vos priorités</h3>
            <p>Organisez ce qui compte vraiment</p>
          </div>
        </div>
      </div>

      <footer className="styleFooter">
        <p>&copy; 2024 Gautier - Your Task Management Companion</p>
        <nav>
          <ul>
            <li>Marseille, France</li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default HomePage;