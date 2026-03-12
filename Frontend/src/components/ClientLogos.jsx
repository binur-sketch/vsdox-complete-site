import React from 'react';
import hdfcLife from '../assets/hdfclife.png';
import abHousing from '../assets/ABHFL_OG.png';
import heroMoto from '../assets/Hero_MotoCorp-Logo.wine.svg';
import religare from '../assets/Religare-Broking-Ltd..jpg';
import subros from '../assets/subroshlogo.jpg';
import rajasthanHC from '../assets/Logo_of_the_High_Court_of_Rajasthan.png';
import bda from '../assets/BDA.webp';
import bmc from '../assets/bmclogo.png';
import iitDelhi from '../assets/IIT Delhi.svg';
import cskAgri from '../assets/CSK HImachal.jpg';
import iicDelhi from '../assets/iic.png';
import hdfcPension from '../assets/images.jpg';
import meghalayaHealth from '../assets/top-left.jpg';
import dcTelangana from '../assets/District courts of telangana.png';
import delnet from '../assets/Untitled.png';
import pharmacopoeia from '../assets/IPC.jpg';
import govPosts from '../assets/images (2).jpg';
import andhraHC from '../assets/unnamed.png';
import asiaticSociety from '../assets/logo6.jpg';
import madrasHC from '../assets/High Court Madras.jpg';
import odishaDC from '../assets/District Court Odisha.png';
import deccanCollege from '../assets/Deccan college pune.jpeg';
import smsaExpress from '../assets/png-clipart-saudi-arabia-express-inc-smsa-express-air-waybill-retail-others-miscellaneous-purple.png';
import ttdLogo from '../assets/TTD-Logo.png';
import welhamGirls from '../assets/wgs-logo-final.png';
import copycatKenya from '../assets/copycat logo.png';
import registrationOdisha from '../assets/Odisha Dept.jpg';
import allahabadHC from '../assets/District courts of Allahabad.png';
import uti from '../assets/Union Trust of India.png';
import lic from '../assets/Life Insurance Corporation.jpeg';
import utkarsh from '../assets/Utkarsh Small Finance Bank.png';


const baseClients = [
    { name: "HDFC Life Insurance Ltd.", logo: hdfcLife },
    { name: "HDFC Pension Fund Ltd.", logo: hdfcPension },
    { name: "Aditya Birla Housing Finance Limited", logo: abHousing },
    { name: "Union Trust of India", logo: uti },
    { name: "Life Insurance Corporation", logo: lic },
    { name: "Utkarsh Small Finance Bank", logo: utkarsh },
    { name: "Hero MotoCorp Ltd.", logo: heroMoto },
    { name: "Religare Broking Ltd.", logo: religare },
    { name: "Subros Ltd.", logo: subros },
    { name: "Rajasthan High Court", logo: rajasthanHC },
    { name: "District Court, Odisha", logo: odishaDC },
    { name: "Bhubaneswar Development Authority (BDA)", logo: bda },
    { name: "Bhubaneswar Municipal Corporation", logo: bmc },
    { name: "Inspector General of Registration Revenue, Odisha", logo: registrationOdisha },
    { name: "Allahabad District Court, Prayagraj", logo: allahabadHC },
    { name: "Telangana District Court", logo: dcTelangana },
    { name: "Andhra Pradesh High Court", logo: andhraHC },
    { name: "Madras High Court, Chennai", logo: madrasHC },
    { name: "Indian Institute Of Technology Delhi (IIT Delhi)", logo: iitDelhi },
    { name: "CSK Agricultural University, Palampur", logo: cskAgri },
    { name: "Deccan College of Engineering & Tech, Pune", logo: deccanCollege },
    { name: "DELNET-Developing Library Network, Delhi", logo: delnet },
    { name: "India International Centre, Delhi", logo: iicDelhi },
    { name: "Indian Pharmacopoeia Commission", logo: pharmacopoeia },
    { name: "The Asiatic Society of Mumbai", logo: asiaticSociety },
    { name: "Tirumala Tirupati Devasthanams (TTD)", logo: ttdLogo },
    { name: "Dept of Health & Family Welfare, Meghalaya", logo: meghalayaHealth },
    { name: "Welham Girls' School, Dehradun", logo: welhamGirls },
    { name: "Department of Posts, Govt of India", logo: govPosts }

];

// Use exactly 30 items for the grid
const clients = baseClients;

const ClientLogos = () => {
    return (
        <section className="clientele-section reveal">
            <div className="max-container">
                <div className="clientele-header">
                    <span className="info-tag" style={{ margin: '0 auto 16px', display: 'inline-block' }}>Our Trusted Network</span>
                    <h1>Elite Client Roster</h1>
                    <p>Powering documentation for world-class government bodies, healthcare institutions, and enterprise leaders across the globe.</p>
                </div>

                <div className="clientele-grid-static">
                    {clients.map((client, index) => (
                        <div key={index} className="client-card-item">
                            <div className="client-card">
                                {typeof client.logo === 'string' && client.logo.length < 5 ? (
                                    <span className="client-emoji">{client.logo}</span>
                                ) : (
                                    <img src={client.logo} alt={client.name} onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }} />
                                )}
                                <div className="client-initials" style={{ display: 'none' }}>
                                    {client.name.substring(0, 2).toUpperCase()}
                                </div>
                            </div>
                            <span className="client-name-label">{client.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientLogos;
