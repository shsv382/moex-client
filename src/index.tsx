import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Index from './pages/Index/Index';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { StockPage } from './pages/StockPage';

const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/",
          element: <Index />,
        },
        {
          path: "stocks/:ticker",
          element: <StockPage />
        },
      ]
  },
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
