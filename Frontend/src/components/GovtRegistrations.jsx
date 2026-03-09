import React from 'react';
import gemLogo from '../assets/GeM logo.webp';
import msmeLogo from '../assets/msme logo.webp';

const GovtRegistrations = () => {
    return (
        <section className="govt-registrations reveal">
            <div className="max-container">
                <div className="registrations-container">
                    <div className="reg-item">
                        <img src={gemLogo} alt="GeM Registered" style={{ height: '50px' }} />
                        <div className="reg-info">
                            <h4>GeM Registered</h4>
                            <p>Government e-Marketplace</p>
                        </div>
                    </div>
                    <div className="reg-item">
                        <img src={msmeLogo} alt="MSME Registered" />
                        <div className="reg-info">
                            <h4>MSME Registered</h4>
                            <p>Micro, Small & Medium Enterprises</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GovtRegistrations;
