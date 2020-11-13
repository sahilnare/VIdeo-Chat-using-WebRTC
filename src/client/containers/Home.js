import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <>
      <h1>Home page</h1>
      <Link to="/groupchat">Go to the chat room</Link>
    </>
  );
}

export default Home;
