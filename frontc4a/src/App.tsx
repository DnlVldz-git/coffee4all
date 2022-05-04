import "./App.css";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./components/public/login";
import { useContext, useEffect, useState } from "react";
import { FullPageLoading } from "./components/public/fullPageLoading";
import { AuthContext, IAuthContext } from "./components/context/AuthContext";
import Index from "./components/admin/index";
import VentasPanel from "./components/public/ventas";

export default function App() {
  const { currentUser, checkUser } = useContext(AuthContext) as IAuthContext;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const publicRoutes = (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );

  const userRoutes = (
    <Routes>
      <Route path="/" element={<VentasPanel />} />
    </Routes>
  );

  const adminRoutes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/ventas" element={<VentasPanel />} />
    </Routes>
  );

  const getRoute = () => {
    if (loading) {
      return (
        <Routes>
          <Route path="/" element={<FullPageLoading />} />
        </Routes>
      );
    }

    if (!currentUser) return publicRoutes;
    
    if (currentUser.isAdmin()) {
      return adminRoutes;
    } else {
      return userRoutes;
    }
  };

  return (
    <>      
      <BrowserRouter>{getRoute()}</BrowserRouter>
    </>
  );
}
