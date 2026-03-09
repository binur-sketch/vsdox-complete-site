import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="app-container">
            <Navbar />
            <div style={{ minHeight: 'calc(100vh - 160px)' }}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
