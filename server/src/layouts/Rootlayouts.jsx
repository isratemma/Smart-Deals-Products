import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import { Outlet } from 'react-router-dom';

const Rootlayouts = () => {
  return (
    <div className='max-w-7xl mx-auto'>
      <NavBar></NavBar>
      <Outlet></Outlet>
    </div>
  );
};

export default Rootlayouts;