import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from './Login.jsx';
import Register from './Register.jsx';
import App from './App.jsx';
import Homepage from './Homepage.jsx';
import PasswordPage from './PasswordPage.jsx';

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
    path: '/pwdManager',
    element: <PasswordPage />,
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
<RouterProvider router={router} />

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
