import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userData, setuserData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", userData);
      navigate("/MyNotes");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
     <div className="register-container">
      <h2>Create an Account</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={userData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
         {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>
    </div>
  );
}
export default RegisterPage;
