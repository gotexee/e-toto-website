
import './Homepage.css';
import logo from '../Assets/logo.png';
import { Link } from "react-router-dom";


const HomePage = () => {
  return(
    <div className="welcome_1div">
      <div className="Logo">
             <img src ={logo} alt="PGT logo" className="welcome-logo" />
      <hr className = "welcome-divider"/>
         </div>
      <h1 className="welcome-title"> WELCOME <span role="img" aria-label="wave">👐</span>
      </h1>
      <p className="welcome-text">
        Gérez vos tâches, fixez vos priorités et suivez vos progrès facilement.<br />
        Organisez votre journée et restez productif en un clin d'œil !
      </p>

      <p className="welcome-subtext">
        <strong>PGT</strong>, votre compagnon de tous les jours.<br />
        Démarrez votre expérience ici.
      </p>
      <Link to="/login">
      <button className="commencer_button">Commencer</button>
      </Link>
      <footer className="styleFooter">
                <p>&copy; 2024 Mon Projet (je viens de mettre ca dans le footer) React</p>
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