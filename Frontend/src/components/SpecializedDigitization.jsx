import React from 'react';
import { motion } from 'framer-motion';

const SpecializedDigitization = () => {
    const categories = [
        {
            icon: 'fa-scroll',
            title: "Pothi's & Manuscripts",
            desc: "Expert preservation and high-resolution imaging of delicate palm-leaf manuscripts, ancient Pothis, and brittle handwritten records with non-invasive techniques.",
            color: '#7c3aed'
        },
        {
            icon: 'fa-film',
            title: "Audio Video Collections",
            desc: "Advanced digitization of legacy multimedia formats including magnetic tapes, film reels, and cassettes into modern streaming-ready digital assets.",
            color: '#059669'
        },
        {
            icon: 'fa-map',
            title: "Maps & Atlases",
            desc: "Precision digitization of oversized documents, historical maps, architectural blueprints, and atlases with absolute geometrical accuracy.",
            color: '#dc2626'
        },
        {
            icon: 'fa-book-open',
            title: "Books & Publications",
            desc: "High-quality scanning of out-of-print books, scholarly journals, and historic publications with advanced OCR for full-text search.",
            color: '#ea580c'
        },
        {
            icon: 'fa-graduation-cap',
            title: "Theses & Dissertations",
            desc: "Digitization of academic research, theses, and dissertations for integration into global institutional repositories and digital libraries.",
            color: '#1d63ed'
        },
        {
            icon: 'fa-microscope',
            title: "Microfilm Digitization",
            desc: "Specialized conversion of microfilm roles and microfiche sheets into high-fidelity digital files for long-term accessibility.",
            color: '#0891b2'
        }
    ];

    return (
        <section className="specialized-digitization section-padding reveal">
            <div className="max-container">
                <div className="section-header-v2" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div className="info-tag">Heritage Preservation</div>
                    <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px', color: 'var(--text-dark)' }}>Multimedia & Heritage Digitization</h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '850px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6' }}>
                        Beyond standard document scanning, VSDOX specializes in the preservation of complex historical and multimedia archives, transforming fragile heritage into permanent digital legacy.
                    </p>
                </div>

                <div className="digitization-formats-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '30px'
                }}>
                    {categories.map((item, idx) => (
                        <div key={idx} className="format-card" style={{
                            background: 'white',
                            padding: '40px',
                            borderRadius: '24px',
                            border: '1px solid var(--border)',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)'
                        }}>
                            <div className="format-glow" style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                width: '100px',
                                height: '100px',
                                background: item.color,
                                opacity: 0.05,
                                filter: 'blur(40px)',
                                borderRadius: '50%'
                            }}></div>

                            <div style={{
                                fontSize: '40px',
                                marginBottom: '24px',
                                color: item.color,
                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                            }}>
                                <i className={`fas ${item.icon}`}></i>
                            </div>

                            <h3 style={{
                                fontSize: '22px',
                                fontWeight: '800',
                                marginBottom: '16px',
                                color: 'var(--text-dark)'
                            }}>{item.title}</h3>

                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '15px',
                                lineHeight: '1.7'
                            }}>{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="digitization-cta" style={{
                    marginTop: '60px',
                    padding: '40px',
                    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '40px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h4 style={{ color: 'white', fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>Preserving History for the Digital Age</h4>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px' }}>Our technology ensures that even the most fragile and high-complexity formats are captured with absolute precision.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <a href="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', border: 'none' }}>Discuss Your Project</a>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .format-card:hover {
                    transform: translateY(-10px);
                    border-color: var(--primary);
                    box-shadow: 0 30px 60px -20px rgba(29, 99, 237, 0.15);
                }
                .format-card:hover h3 {
                    color: var(--primary);
                }
            `}} />
        </section>
    );
};

export default SpecializedDigitization;
