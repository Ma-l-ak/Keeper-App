import HighlightIcon from "@mui/icons-material/Highlight";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <h1>
        <HighlightIcon />
        Keeper App
      </h1>
      <nav className="nav-links">
        <Link to="/MyNotes">Profile</Link>
        <span className="separator">|</span>
        <Link to="/login">Login</Link>
        <span className="separator">|</span>
        <Link to="/register">Register</Link>
      </nav>
    </header>
  );
}

export default Header;
