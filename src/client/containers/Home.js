import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <>
      <h1>Home page</h1>
      <Link to="/room">Go to video conference room</Link>
    </>
  );
}

export default Home;
