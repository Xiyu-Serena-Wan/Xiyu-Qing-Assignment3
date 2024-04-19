import React from 'react';
import ReactDOM from 'react-dom/client';
import PokemonPage from './PokemonPage.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import App from './App.jsx';
// import Navbar from './components/NavBar.jsx'
import Homepage from './Homepage.jsx';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/homepage',
    element: <Homepage />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/pokemon',
    element: <PokemonPage />,
  },
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/app',
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
