
import './Style/App.css';
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import LoginSignup from './Components/LoginSignup/LoginSignup';
import SignIn from './Components/SignIn/SignIn';
import Homepage from './Components/Homepage/Homepage';
import Application1 from './Components/Application/Application1';
import RootLayout from "./Layout";
import Application3 from './Components/Application/Application3';
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Calendar from "./Components/Calendar/todolist";
import NotFoundPage from './Pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "home",
        element: (
          <div>
            <Homepage />
            <nav>
              <Link to="/login"></Link>
            </nav>
          </div>
        ),
      },
      {
        path: "login",
        element: (
          <div>
            <LoginSignup />
            <nav>
              <Link to="/signin"></Link>
            </nav>
          </div>
        ),
      },
      {
        path: "signin",
        element: (
          <div>
            <SignIn />
            <nav>
              <Link to="/Application">Application</Link>
            </nav>
          </div>
        ),
      },
      {
        path: "Application",
  element: (
    <ProtectedRoute>
      <Application1 />
    </ProtectedRoute>
  ),
      },
      {
        path: "todolist",
        element: (
          <div>
            <Calendar />
          </div>
        ),
      },
      {
        path: "today",element: (
          <div>
            <Calendar />
          </div>
        ),
        element: (
          <div>
            <application2 />
          </div>
        ),
      },
      {
        path: "history",
        element: (
          <div>
            <Application3 />
          </div>
        ),
      },
      {
        path: "*",
        element: (
          <div>
            <NotFoundPage />
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
