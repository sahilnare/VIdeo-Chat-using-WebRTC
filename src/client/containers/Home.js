import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <>
      <h1>Hola Peeps!</h1>
      <p>Voice based social network</p>
      <Link to="/groupchat">Go to the chat room</Link>
    </>
  );
}

export default Home;
