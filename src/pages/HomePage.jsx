import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="welcome-container">
      <h1>Welcome to Keeper</h1>
      <p>Your personal space to keep track of notes and ideas.</p>
      <div className="welcome-buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
