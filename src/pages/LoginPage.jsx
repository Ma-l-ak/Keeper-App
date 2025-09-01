import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const[userData,setUserData]=useState({email:"",password:""});

  const handleChange=(event)=>{
    const {name,value}=event.target;
    setUserData(prevData=>{
      return{
        ...prevData,
        [name]:value
      }
    })  
  }
  const handleSubmit=async (event)=>{
     event.preventDefault();
      try {
      await axios.post("http://localhost:5000/login", userData);
      setUserData({ email: "", password: "" }); 
      navigate("/MyNotes");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          < input onChange={handleChange} value={userData.email} name="email" type="text" placeholder="Username" required />
          < input onChange={handleChange} value={userData.password} name ="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
           {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
