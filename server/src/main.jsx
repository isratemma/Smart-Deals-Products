import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import Home from './pages/Home';
import About from './pages/About';

import Rootlayouts from './layouts/Rootlayouts';
import AllProducts from './components/AllProducts/AllProducts';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Rootlayouts,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'AllProducts',
        Component: AllProducts,
      },
    ],
  },
  {
    path: '/about',
    element: <About />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
