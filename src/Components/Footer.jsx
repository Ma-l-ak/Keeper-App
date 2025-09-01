import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ backgroundColor: "#f5ba13" }}>
      <p>Copyright ⓒ {year}</p>
    </footer>
  );
}

export default Footer;
