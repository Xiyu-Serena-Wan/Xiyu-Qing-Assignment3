import React from 'react';
import Navbar from './components/NavBar';

function Homepage() {
  return (
    <div>
      <Navbar />
      <br></br>
      <br></br>

      <div style={{display:'flex', justifyContent:'center'}}>
      <h1>Welcome to my website</h1>
      </div>
    </div>
  );
}

export default Homepage;
