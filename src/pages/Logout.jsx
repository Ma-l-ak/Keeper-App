import { useEffect } from "react";
// import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  // const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/"); 
  }, [navigate]);

  return (<></>
    ); 
}
