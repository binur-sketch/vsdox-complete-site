import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpecializedDigitization from '../components/SpecializedDigitization';

const PageHero = ({ tag, title, subtitle, bgImage }) => (
    <section style={{
        backgroundImage: bgImage
            ? `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${bgImage})`
            : 'linear-gradient(135deg, #0f172a 0%, #1d2f4a 100%)',
        backgroundColor: '#0f172a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '160px 0 80px',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '80px'
    }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(29,99,237,0.07)', top: '-200px', right: '-100px' }} />
        <div className="max-container reveal">
            {tag && (
                <span style={{
                    display: 'inline-block', background: 'rgba(29,99,237,0.18)', color: '#60a5fa',
                    fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em',
                    padding: '6px 14px', borderRadius: '100px', marginBottom: '20px',
                    border: '1px solid rgba(96,165,250,0.3)'
                }}>{tag}</span>
            )}
            <h1 style={{ fontSize: 'clamp(30px, 4vw, 56px)', fontWeight: '900', color: 'white', marginBottom: '16px', lineHeight: 1.1 }}>{title}</h1>
            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.7)', maxWidth: '620px', lineHeight: 1.7 }}>{subtitle}</p>
        </div>
    </section>
);

const DigitizationServices = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in'));
    }, []);

    return (
        <main>
            <PageHero
                tag="SPECIALIZED SERVICES"
                title="Multimedia & Heritage Digitization"
                subtitle="Transforming fragile historical archives into permanent digital legacies using state-of-the-art preservation technology."
                bgImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2400&auto=format&fit=crop"
            />
            <SpecializedDigitization />

            <section style={{ padding: '80px 0', background: '#f8fafc' }}>
                <div className="max-container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
                        <div className="reveal">
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>Our Preservation Philosophy</h2>
                            <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '20px' }}>
                                At VSDOX, we understand that historical documents, audio tapes, and microfilms are more than just data—they are a link to our collective heritage. Our digitization process is designed to be non-invasive and highly precise.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {[
                                    'Non-destructive scanning for fragile manuscripts',
                                    'High-fidelity audio & video restoration',
                                    'Geometric precision for maps and blueprints',
                                    'Metadata enrichment for deep searchability'
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontWeight: '600', color: 'var(--text-dark)' }}>
                                        <i className="fas fa-check-circle" style={{ color: 'var(--primary)' }}></i>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="reveal" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2400&auto=format&fit=crop" alt="Digital Archive" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section reveal">
                <div className="max-container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900', color: 'white', marginBottom: '20px' }}>Preserve Your Institution's History Today</h2>
                    <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.85)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.7' }}>
                        Join leading national archives and libraries in the journey to digital preservation. Let our experts provide a custom strategy for your heritage collections.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', padding: '16px 36px', fontSize: '16px', fontWeight: '800' }}>
                            Talk to a Preservation Expert
                        </Link>
                        <Link to="/request-demo" className="btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '16px 36px', fontSize: '16px', fontWeight: '800' }}>
                            Request Digitization Demo
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default DigitizationServices;
