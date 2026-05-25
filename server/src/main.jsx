import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import Rootlayouts from './layouts/Rootlayouts';
import Home from './pages/Home';
import About from './pages/About';
import AllProducts from './components/AllProducts/AllProducts';
import MyProducts from './components/MyProducts/MyProducts';
import MyBids from './components/MyBids/MyBids';
import CreateProduct from './pages/CreateProduct';
import Register from './components/register/Register';
import Login from './components/Login/Login';
import AuthProvides from './context/AuthProvides';
import ProductDetails from './components/AllProducts/ProductDetails';

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
      {
        path: 'my-products',
        Component: MyProducts,
      },
      {
        path: 'my-bids',
        Component: MyBids,
      },
      {
        path: 'productDetails/:id',
        loader:({params})=>fetch(`http://localhost:3000/products/${params.id}`),
        Component:ProductDetails,
      },
      {
        path: 'create-product',
        Component: CreateProduct,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'register',
        Component: Register,
      },
      {
        path: 'login',
        Component: Login,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvides>
      <RouterProvider router={router} />
    </AuthProvides>
  </React.StrictMode>
);
