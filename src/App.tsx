import React from 'react';
import Index from './pages/Index/Index';
import styles from './App.module.scss';
import { Outlet, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';

const App = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

export default App;
