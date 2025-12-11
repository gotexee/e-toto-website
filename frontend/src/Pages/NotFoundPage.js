

import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div>
            <h1>Not found page</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to={"/home"}>
            <button>Go to Homepage</button>
            </Link>
        </div>
    );
}; 

export default NotFoundPage;