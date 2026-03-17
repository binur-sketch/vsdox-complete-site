import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';
import { APP_CONTACT, COMPANY, LINKS, SOCIAL_LINKS } from '../config/appConstants';

const Footer = () => {
    return (
        <footer className="footer-main">
            <div className="max-container">
                <div className="footer-grid-top">
                    {/* Brand Column */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src={logo} alt="VSDOX – AI-Powered Enterprise Content Management by Vir Softech" />
                        </Link>
                        <p className="footer-tagline">
                            Empowering organizations with AI-driven Enterprise Content Management solutions. Move your document databases online with confidence.
                        </p>
                        <div className="social-links-footer">
                            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-box social-instagram" title="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="social-icon-box social-youtube" title="YouTube">
                                <i className="fab fa-youtube"></i>
                            </a>
                            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="social-icon-box social-facebook" title="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-box social-linkedin" title="LinkedIn">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="social-icon-box social-x" title="X (Twitter)">
                                <i className="fab fa-x-twitter"></i>
                            </a>
                        </div>
                    </div>

                    {/* Solutions Column */}
                    <div className="footer-links-col">
                        <h5>Solutions</h5>
                        <ul>
                            <li><Link to="/solutions/banking-bfsi">BFSI</Link></li>
                            <li><Link to="/solutions/government">Government</Link></li>
                            <li><Link to="/solutions/judiciary">Judiciary</Link></li>
                            <li><Link to="/solutions/corporate">Corporate</Link></li>
                            <li><Link to="/solutions/healthcare">Healthcare</Link></li>
                            <li><Link to="/solutions/education">Education</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-col">
                        <h5>Company</h5>
                        <ul>
                            <li><Link to="/about">About Vir Softech</Link></li>
                            <li><Link to="/blog">Blog & Insights</Link></li>
                            <li><Link to="/case-studies">Case Studies</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-links-col contact-col">
                        <h5>Contact Info</h5>
                        <ul className="contact-info-list">
                            <li>
                                <span className="info-icon"><i className="fas fa-location-dot"></i></span>
                                <span>{COMPANY.name}<br />A 306, The I Thum, Plot No. A 40,<br />Sector 62, Noida, India</span>
                            </li>
                            <li>
                                <span className="info-icon"><i className="fas fa-envelope"></i></span>
                                <a href={LINKS.mailToRecipient}>{APP_CONTACT.recipientEmail}</a>
                            </li>
                            <li>
                                <span className="info-icon"><i className="fas fa-phone"></i></span>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <a href={LINKS.telTollFree}>{APP_CONTACT.tollFree}</a>
                                    <span>|</span>
                                    <a href={LINKS.telLandline}>{APP_CONTACT.landline}</a>
                                </div>
                            </li>
                            <li>
                                <span className="info-icon"><i className="fab fa-whatsapp"></i></span>
                                <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">{APP_CONTACT.whatsapp}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom-v2">
                    <p>&copy; {new Date().getFullYear()} <a href="https://www.virsoftech.com" style={{ textDecoration: 'none' }}>Vir Softech Pvt. Ltd.</a> All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms">Terms & Cond.</Link>
                        <Link to="/blog">Blog</Link>
                        <Link to="/case-studies">Case Studies</Link>
                        <Link to="/contact">Contact</Link>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
