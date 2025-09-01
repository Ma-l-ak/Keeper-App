import HighlightIcon from "@mui/icons-material/Highlight";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function Header() {
  const { user} = useAuth();
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
            <Link to="/logout">Logout</Link> 
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
