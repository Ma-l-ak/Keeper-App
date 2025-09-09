import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import { Outlet} from "react-router-dom";
import {useState} from "react";

function RootLayout() {
   const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  return (
    <div>
      <Header  />
      <Outlet />   
      <Footer />
    </div>
  );
}
export default RootLayout;