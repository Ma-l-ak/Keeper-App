import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../Context/UserContext";

function RegisterPage() {
  const navigate = useNavigate();
  // const { setUser } = useAuth(); 
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
      const res= await axios.post("http://localhost:5000/register", userData);
      //setUser({ name: userData.name, email: userData.email });
      // console.log(res.data.user);
      // setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("storage"));
      setuserData({ name: "", email: "", password: "" });
      navigate("/mynotes");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed"); 
    }
  };

  return (
     <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
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
