import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return <Outlet />;
}

export default RootLayout;
