import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import { useAuth } from '../context/AuthContext';

const solutionsDropdown = [
    {
        to: '/digitization-services',
        label: 'Digitization Services',
        icon: 'fa-file-zipper',
        desc: 'Multimedia & heritage preservation (Manuscripts, AV, Maps).'
    },
    {
        to: '/solutions/banking-bfsi',
        label: 'BFSI',
        icon: 'fa-university',
        desc: 'Advanced document processing for financial institutions.'
    },
    {
        to: '/solutions/government',
        label: 'Government',
        icon: 'fa-landmark',
        desc: 'Public sector digital transformation and citizen services.'
    },
    {
        to: '/solutions/judiciary',
        label: 'Judiciary',
        icon: 'fa-gavel',
        desc: 'E-court management and legal document organization.'
    },
    {
        to: '/solutions/corporate',
        label: 'Corporate',
        icon: 'fa-building',
        desc: 'Enterprise-grade ECM for streamlined workflows.'
    },
    {
        to: '/solutions/healthcare',
        label: 'Healthcare',
        icon: 'fa-hospital',
        desc: 'Secure medical record management and digitization.'
    },
    {
        to: '/solutions/education',
        label: 'Education',
        icon: 'fa-graduation-cap',
        desc: 'Digital campus solutions for schools and universities.'
    },
];

const DropdownMenu = ({ items }) => (
    <div className="nav-dropdown">
        <div className="nav-dropdown-inner">
            {items.map((item, i) => (
                <Link key={i} to={item.to} className="dropdown-item">
                    <span className="dropdown-icon">
                        <i className={`fas ${item.icon}`}></i>
                    </span>
                    <div className="dropdown-content">
                        <div className="dropdown-label">{item.label}</div>
                        <div className="dropdown-desc">{item.desc}</div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const navRef = useRef(null);
    const { user, logout } = useAuth();

    const closeMenu = () => setMenuOpen(false);

    // Close mobile menu on route change
    useEffect(() => { closeMenu(); }, [location.pathname]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        closeMenu();
        await logout();
        navigate('/');
    };

    return (
        <nav className="navbar" ref={navRef}>
            <Link to="/" className="nav-logo" onClick={closeMenu}>
                <img src={logo} alt="VSDOX – Enterprise Content Management Platform by Vir Softech" style={{ height: '40px' }} />
            </Link>

            {/* Desktop Nav Links */}
            <div className="nav-links">

                {/* Solutions Dropdown — CSS :hover driven */}
                <div className="nav-dropdown-wrapper">
                    <Link
                        to="/solutions"
                        className="nav-link nav-link-btn"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                    >
                        Solutions <i className="fas fa-chevron-down dropdown-arrow"></i>
                    </Link>
                    <DropdownMenu items={solutionsDropdown} />
                </div>

                <Link to="/case-studies" className="nav-link">Case Studies</Link>
                <Link to="/about" className="nav-link">About Us</Link>
                <Link to="/blog" className="nav-link">Blog</Link>
                <Link to="/contact" className="nav-link">Contact Us</Link>
            </div>

            {/* Desktop Right Actions */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                <Link to="/request-demo" className="btn-signin" style={{ textDecoration: 'none' }}>
                    Request Demo
                </Link>

                {user && (
                    <div className="user-dropdown-wrapper">
                        {/* User pill */}
                        <div
                            className="user-pill"
                            onClick={() => setUserMenuOpen(prev => !prev)}
                            style={{ cursor: "pointer" }}>
                            <div className="user-avatar">
                                {user.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <span className="user-name">{user.name}</span>
                            <i className="fas fa-chevron-down user-arrow"></i>
                        </div>

                        {/* Logout Dropdown */}
                        <div
                            className="user-dropdown"
                            style={{ display: userMenuOpen ? "block" : "none" }}>
                            <button onClick={handleLogout} className="user-dropdown-item">
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Hamburger Button */}
            <button
                className="hamburger-btn"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-bar ${menuOpen ? 'open' : ''}`}></span>
            </button>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">

                    <div className="mobile-section-label">Solutions</div>

                    {solutionsDropdown.map((item, i) => (
                        <Link key={i} to={item.to} className="mobile-menu-link mobile-sub-link" onClick={closeMenu}>
                            <i className={`fas ${item.icon}`} style={{ marginRight: '10px', color: 'var(--primary)' }}></i>
                            {item.label}
                        </Link>
                    ))}

                    <Link to="/case-studies" className="mobile-menu-link" onClick={closeMenu}>Case Studies</Link>
                    <Link to="/about" className="mobile-menu-link" onClick={closeMenu}>About Us</Link>
                    <Link to="/blog" className="mobile-menu-link" onClick={closeMenu}>Blog</Link>
                    <Link to="/contact" className="mobile-menu-link" onClick={closeMenu}>Contact Us</Link>

                    <Link to="/request-demo" className="btn-signin mobile-demo-btn" onClick={closeMenu}>
                        Request Demo
                    </Link>

                    {/* Auth section in mobile menu */}
                    {user && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '12px' }}>
                            {/* User info row */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 16px', marginBottom: '8px',
                            }}>
                                <div style={{
                                    width: '34px', height: '34px', borderRadius: '50%',
                                    background: 'var(--primary)', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '14px', fontWeight: '700', color: 'white',
                                }}>
                                    {user.name?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'inherit' }}>{user.name}</div>
                                    <div style={{ fontSize: '11px', opacity: 0.6, color: 'inherit' }}>{user.role}</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mobile-menu-link"
                                style={{
                                    width: '100%', textAlign: 'left', background: 'transparent',
                                    border: 'none', cursor: 'pointer', color: '#f87171',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                }}
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </button>

                        </div>
                    )}

                </div>
            )}
        </nav>
    );
};

export default Navbar;