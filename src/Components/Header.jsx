import HighlightIcon from "@mui/icons-material/Highlight";
import { Link } from "react-router-dom";
// import { useAuth } from "../Context/AuthContext";
import { useState, useEffect } from "react";

function Header() {
  // const { user} = useAuth();
   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  //  const user = JSON.parse(localStorage.getItem("user")) || null;
   useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <header>
      <nav className="nav-links">
      <h1>
        <HighlightIcon />
      <Link to ="/">Keeper App</Link>
      </h1>
      </nav>
      <nav className="nav-links">
         {user ? (
          <>
            <Link to="/mynotes">{user.name || "Profile"}</Link>
            <span className="separator">|</span>
            <Link to="/logout" onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null); // immediate update
              }}>Logout</Link> 
            
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <span className="separator">|</span>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
export default Header;
