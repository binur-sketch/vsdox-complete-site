import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { handleFormSubmission } from '../utils/formHandler';
import { APP_CONTACT, DEFAULTS, LINKS } from '../config/appConstants';
import SEO from '../components/SEO';


import MilestoneTimeline from '../components/MilestoneTimeline';
import teamBanner from '../assets/team-member.jpeg';

const PageHero = ({ title, subtitle, bgImage }) => (
    <section className="page-hero-container" style={{
        backgroundImage: bgImage
            ? `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url("${bgImage}")`
            : 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        backgroundColor: '#0f172a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '120px 0'
    }}>
        <div className="max-container" style={{ position: 'relative', zIndex: 2 }}>
            <div className="page-hero-content reveal" style={{ textAlign: 'center', margin: '0 auto' }}>
                <h1 style={{ color: 'white' }}>{title}</h1>
                <p style={{ color: 'white', margin: '0 auto 30px', maxWidth: '800px' }}>{subtitle}</p>
                <div className="breadcrumb" style={{ justifyContent: 'center' }}>
                    <Link to="/">Home</Link> <span>/</span> <span>{title}</span>
                </div>
            </div>
        </div>
    </section>
);

const SectionInfo = ({ title, subtitle, content, image, reverse, items }) => (
    <section className={`section-info ${reverse ? 'reverse' : ''} max-container reveal`}>
        <div className="info-text">
            <span className="info-tag">{subtitle}</span>
            <h2>{title}</h2>
            <p>{content}</p>
            {items && (
                <ul className="info-list">
                    {items.map((item, i) => (
                        <li key={i}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5 10L8 13L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        <div className="info-image">
            <div className="glass-card image-wrapper">
                <img src={image} alt={title} />
            </div>
        </div>
    </section>
);

export const Products = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in'));
    }, []);

    const coreModules = [
        {
            icon: 'fa-folder-open',
            title: 'Document Management System (DMS)',
            color: '#1d63ed',
            features: [
                'Hierarchical repository with department & folder-level access',
                'Multi-format support: PDF, DOCX, XLSX, images, videos & more',
                'Version control with full revision history',
                'Bulk upload, drag-and-drop, and scanner integration',
                'PDF/A compliant archival format',
                'Dublin Core metadata indexing standard',
            ]
        },
        {
            icon: 'fa-magnifying-glass',
            title: 'Intelligent Search & Retrieval',
            color: '#7c3aed',
            features: [
                'Full-text search across all ingested documents',
                'Phonetic, fuzzy & thesaurus-based search',
                'Advanced faceted & nested-faceted filtering',
                'Multilingual search with transliteration support',
                'Voice-based search (Speech-to-Text)',
                'RAG-Based Q&A for document-level contextual queries',
            ]
        },
        {
            icon: 'fa-diagram-project',
            title: 'Workflow & Process Automation',
            color: '#059669',
            features: [
                'Static multi-level approval workflows (1, 2, 3 levels)',
                'Dynamic / ad-hoc workflow with real-time routing',
                'Hierarchical verification for sensitive records',
                'Role-based reviewer assignment & escalation',
                'Mandatory comments at every approval stage',
                'Full audit trail of every workflow action',
            ]
        },
        {
            icon: 'fa-robot',
            title: 'AI-Powered Capabilities',
            color: '#db2777',
            features: [
                'Automatic Document Type Association & Segregation',
                'AI Metadata Extraction (case IDs, dates, names, IDs)',
                'Document Summarization for long case files (50–500 pages)',
                'On-premise RAG-Based Q&A Engine',
                'AI Translation into multiple languages',
                'AI Transliteration for multilingual search',
                'Multilingual Speech-to-Text input',
                'Full UI localization in Hindi, Malayalam & more',
            ]
        },
        {
            icon: 'fa-camera',
            title: 'Capture & Digitization Solution',
            color: '#d97706',
            features: [
                'Physical file inventory & batch creation',
                'High-resolution scanning & automated image processing',
                'Auto deskew, despeckle, punch-hole removal',
                'Multilingual OCR for text recognition',
                'Multi-level Quality Checks (Scanning QC, Indexing QC, Client QC)',
                'Export as PDF/A with Dublin Core metadata ZIP',
            ]
        },
        {
            icon: 'fa-shield-halved',
            title: 'Security & Compliance',
            color: '#dc2626',
            features: [
                'AES-256 encryption at rest & TLS/SSL in transit',
                'Multi-Factor Authentication (CAPTCHA, OTP, SMTP)',
                'Role-Based Access Control (RBAC) at department & file level',
                'LDAP / Active Directory SSO integration',
                'Digitally signed JWT session tokens',
                'OWASP compliance & VAPT/STQC validated',
                'Time-bound access control & backup scheduler',
            ]
        },
    ];

    const aiHighlights = [
        { icon: 'fa-microchip', label: 'Document Summarization' },
        { icon: 'fa-comments', label: 'RAG-Based Q&A' },
        { icon: 'fa-language', label: 'AI Translation & Transliteration' },
        { icon: 'fa-tags', label: 'Auto Metadata Extraction' },
        { icon: 'fa-object-group', label: 'Document Type Association' },
        { icon: 'fa-microphone', label: 'Speech-to-Text' },
        { icon: 'fa-globe', label: 'UI Multilingual Localization' },
        { icon: 'fa-filter', label: 'Document Segregation' },
    ];

    const deploymentOptions = [
        {
            icon: 'fa-server',
            title: 'On-Premise',
            desc: 'Full control over your data, infrastructure, security and compliance. Hosted on your own servers.',
            color: '#1d63ed',
        },
        {
            icon: 'fa-cloud',
            title: 'Cloud',
            desc: 'Host on MeitY-empanelled NIC Cloud, STPI, AWS, or GCP for scalable, managed infrastructure.',
            color: '#7c3aed',
        },
        {
            icon: 'fa-network-wired',
            title: 'Hybrid',
            desc: 'Combine on-premise and cloud in a seamless hybrid architecture for optimal compliance and performance.',
            color: '#059669',
        },
    ];

    const stats = [
        { number: '200M+', label: 'Documents Processed' },
        { number: '500+', label: 'Enterprise Clients' },
        { number: '25+', label: 'Years Combined Expertise' },
        { number: '99.9%', label: 'Platform Uptime' },
    ];

    return (
        <>
            <SEO
                title="VSDOX Platform – Enterprise Content Management System | DMS Features"
                description="Explore VSDOX's complete ECM platform: DMS, AI-powered search, workflow automation, capture digitization, security & compliance — all in one open-source solution."
                keywords="VSDOX features, ECM platform, DMS features, document workflow automation, AI search, enterprise content management India, DMS, Document Management System, ECM, Enterprise Content Management System, AI-powered document management, Secure ECM, Scalable Enterprise Content Management, Intelligent capture, Seamless integration, Lifecycle automation, Advanced search, Digital operations, Content platform, Cloud-based centralized repository, Version control, Auditability, Approval workflows, Electronic DMS, Records Management, Content lifecycle management, API integration, Document classification"
            />
            {/* Hero */}
            <PageHero
                title="VSDOX — Enterprise Content Management"
                subtitle="A secure, AI-powered, open-source based platform for intelligent document management, workflow automation, and enterprise-grade compliance."
                bgImage="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2340&auto=format&fit=crop"
            />

            {/* Stats Strip */}
            <section style={{ background: '#0f172a', padding: '40px 0' }}>
                <div className="max-container">
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: '24px', 
                    textAlign: 'center' 
                }}>
                    {stats.map((s, i) => (
                        <div key={i} style={{ padding: '20px' }}>
                            <div style={{ fontSize: 'clamp(32px, 4vw, 42px)', fontWeight: '900', color: '#1d63ed' }}>{s.number}</div>
                            <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
                </div>
            </section>

            {/* Product Overview */}
            <section style={{ padding: 'clamp(60px, 8vw, 100px) 0', background: 'white' }}>
                <div className="max-container reveal">
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                        gap: 'clamp(40px, 6vw, 80px)', 
                        alignItems: 'center' 
                    }}>
                        <div>
                            <span style={{ display: 'inline-block', background: 'rgba(29,99,237,0.08)', color: '#1d63ed', padding: '6px 16px', borderRadius: '30px', fontWeight: '700', fontSize: '13px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>What is VSDOX?</span>
                            <h2 style={{ fontSize: '44px', fontWeight: '900', lineHeight: '1.1', marginBottom: '24px', color: '#0f172a', letterSpacing: '-0.02em' }}>The Intelligent Heart of Your Document Operations</h2>
                            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.8', marginBottom: '24px', textAlign: 'justify' }}>
                                VSDOX is Vir Softech's flagship Enterprise Content Management platform — a secure, scalable, and AI-powered solution built on a modern open-source technology stack. It is designed to manage the complete lifecycle of enterprise, judicial, and institutional content: from physical digitization to intelligent search and controlled access.
                            </p>
                            <p style={{ fontSize: '17px', color: '#475569', lineHeight: '1.8', marginBottom: '32px', textAlign: 'justify' }}>
                                VSDOX eliminates vendor lock-in, reduces operational costs, and empowers organizations to digitally transform their document workflows without replacing existing infrastructure.
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {['Open-Source Based', 'No Seat-Based Licensing', 'ISO 9001:2015 Certified', 'CMMI Level 3', 'VAPT Validated', 'OWASP Compliant'].map((badge, i) => (
                                    <span key={i} style={{ background: '#f1f5f9', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', color: '#334155', border: '1px solid #e2e8f0' }}>{badge}</span>
                                ))}
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.2)', border: '1px solid #e2e8f0' }}>
                                <img src="./src/assets/dashboard.png" alt="VSDOX AI-Powered Enterprise Content Management Dashboard Interface" style={{ width: '100%', height: '420px', objectFit: 'cover' }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '-24px', left: '-24px', background: '#1d63ed', color: 'white', padding: '20px 28px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(29,99,237,0.4)' }}>
                                <div style={{ fontSize: '28px', fontWeight: '900' }}>200M+</div>
                                <div style={{ fontSize: '13px', opacity: 0.85 }}>Documents Managed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Modules */}
            <section style={{ padding: '100px 0', background: '#f8fafc' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '64px' }} className="reveal">
                        <span style={{ display: 'inline-block', background: 'rgba(29,99,237,0.08)', color: '#1d63ed', padding: '6px 16px', borderRadius: '30px', fontWeight: '700', fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Core Modules</span>
                        <h2 style={{ fontSize: '44px', fontWeight: '900', color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.02em' }}>Everything You Need, In One Platform</h2>
                        <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>Six integrated modules that cover the entire content management lifecycle.</p>
                    </div>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                        gap: '28px' 
                    }}>
                        {coreModules.map((mod, i) => (
                            <div key={i} className="reveal" style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '36px',
                                border: '1px solid #e2e8f0',
                                transition: 'all 0.3s ease',
                                cursor: 'default',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = mod.color; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            >
                                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${mod.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: mod.color, marginBottom: '20px' }}>
                                    <i className={`fas ${mod.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0f172a', marginBottom: '16px', lineHeight: '1.3' }}>{mod.title}</h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {mod.features.map((f, j) => (
                                        <li key={j} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#475569', alignItems: 'flex-start' }}>
                                            <i className="fas fa-check-circle" style={{ color: mod.color, marginTop: '2px', flexShrink: 0 }}></i>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Section */}
            <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="max-container reveal">
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <span style={{ display: 'inline-block', background: 'rgba(96,165,250,0.15)', color: '#60a5fa', padding: '6px 16px', borderRadius: '30px', fontWeight: '700', fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Intelligence</span>
                        <h2 style={{ fontSize: '44px', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-0.02em' }}>Built-In AI — Not Bolted On</h2>
                        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>Every AI feature is part of the core VSDOX platform, available on-premise or cloud — no external AI API dependency.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {aiHighlights.map((ai, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(29,99,237,0.15)'; e.currentTarget.style.borderColor = 'rgba(29,99,237,0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                            >
                                <div style={{ fontSize: '32px', color: '#60a5fa', marginBottom: '14px' }}><i className={`fas ${ai.icon}`}></i></div>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: 'white', lineHeight: '1.4' }}>{ai.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Deployment */}
            <section style={{ padding: '100px 0', background: 'white' }}>
                <div className="max-container reveal">
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <span style={{ display: 'inline-block', background: 'rgba(29,99,237,0.08)', color: '#1d63ed', padding: '6px 16px', borderRadius: '30px', fontWeight: '700', fontSize: '13px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Deployment Flexibility</span>
                        <h2 style={{ fontSize: '44px', fontWeight: '900', color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.02em' }}>Deploy Your Way</h2>
                        <p style={{ fontSize: '18px', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: '1.7' }}>VSDOX is architected for maximum deployment flexibility — built on high-availability, containerized, and modular infrastructure.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                        {deploymentOptions.map((opt, i) => (
                            <div key={i} style={{ background: '#f8fafc', borderRadius: '20px', padding: '40px', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'all 0.3s ease' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = opt.color; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.08)`; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: `${opt.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: opt.color, margin: '0 auto 24px' }}>
                                    <i className={`fas ${opt.icon}`}></i>
                                </div>
                                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>{opt.title}</h3>
                                <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.7' }}>{opt.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: 'linear-gradient(135deg, #1d63ed 0%, #7c3aed 100%)', padding: '80px 0', textAlign: 'center' }}>
                <div className="max-container reveal">
                    <h2 style={{ fontSize: '42px', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-0.02em' }}>Ready to Transform Your Document Operations?</h2>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.7' }}>
                        Talk to our ECM experts and get a personalized demo tailored to your industry and scale.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <a href="/request-demo" style={{ background: 'white', color: '#1d63ed', padding: '16px 36px', borderRadius: '10px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', transition: 'all 0.3s ease' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >Request a Demo</a>
                        <a href="/solutions" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 36px', borderRadius: '10px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s ease' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        >Explore Solutions</a>
                    </div>
                </div>
            </section>
        </>
    );
};


export const Solutions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in'));
    }, []);
    return (
        <>
            <SEO
                title="Enterprise ECM Solutions – Digitization, BPM & Automation | VSDOX"
                description="VSDOX enterprise solutions include multimedia heritage digitization, native BPM process automation, and omnichannel content management for complex workflows."
                keywords="enterprise document solutions, document digitization, BPM automation, heritage digitization, ECM solutions India, DMS, Document Management System, ECM, Enterprise Content Management System, AI-powered document management, Secure ECM, Scalable Enterprise Content Management, Intelligent capture, Seamless integration, Lifecycle automation, Advanced search, Digital operations, Content platform, Cloud-based centralized repository, Version control, Auditability, Approval workflows, Electronic DMS, Records Management, Content lifecycle management, API integration, Document classification"
            />
            <PageHero
                title="Enterprise Solutions"
                subtitle="Solved challenges for complex organizational workflows."
                bgImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2340&auto=format&fit=crop"
            />
            <SectionInfo
                title="Multimedia & Heritage Digitization"
                subtitle="SPECIALIZED CONTENT SERVICES"
                content="Expert preservation of fragile archives, rare manuscripts, and legacy media. We transform physical heritage into permanent, searchable digital assets using non-invasive imaging and restoration technologies."
                image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2400&auto=format&fit=crop"
                items={["Rare Manuscripts & Pothis", "Audio Video Digitization", "Large Format Maps & Atlases", "Microfilm & Microfiche Conversion"]}
            />
            <SectionInfo
                title="Native Process Automation"
                subtitle="NATIVE BPM"
                content="Streamline complex end-to-end processes with our native business process management engine. From simple approvals to mission-critical operational workflows, automate everything on a single platform."
                image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2340&auto=format&fit=crop"
                items={["Dynamic Case Management", "Rules Engine (BRMS)", "Robotic Process Automation (RPA)", "Real-time BAM & Analytics"]}
            />
            <SectionInfo
                title="Omnichannel Customer Engagement"
                subtitle="SMART CCM"
                content="Deliver highly personalized, context-aware communications across all customer touchpoints. Automate document generation and distribution for a seamless, secure, and engaging experience."
                image="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2340&auto=format&fit=crop"
                reverse
                items={["Dynamic Document Generation", "Omnichannel Distribution", "Multilingual Communication", "Interactive Digital Forms"]}
            />

        </>
    );
};

export const Industries = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in'));
    }, []);
    return (
        <>
            <SEO
                title="Industry-Specific ECM Solutions – BFSI, Govt, Judiciary, Healthcare | VSDOX"
                description="VSDOX delivers tailored document management solutions for Banking & BFSI, Government, Judiciary, Healthcare, Corporate, and Education sectors across India."
                keywords="industry DMS solutions, BFSI document management, government ECM, judiciary DMS, healthcare records management India, DMS, Document Management System, ECM, Enterprise Content Management System, AI-powered document management, Secure ECM, Scalable Enterprise Content Management, Intelligent capture, Seamless integration, Lifecycle automation, Advanced search, Digital operations, Content platform, Cloud-based centralized repository, Version control, Auditability, Approval workflows, Electronic DMS, Records Management, Content lifecycle management, API integration, Document classification"
            />
            <PageHero
                title="Industry-Specific Solutions"
                subtitle="Tailored document strategies for every sector and scale."
                bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2340&auto=format&fit=crop"
            />
            <div className="max-container reveal" style={{ padding: '80px 0' }}>
                <div className="industry-grid-detailed">
                    <div className="industry-block">
                        <div className="icon-main" style={{ color: 'var(--primary)' }}><i className="fas fa-building"></i></div>
                        <h3>Corporate</h3>
                        <ul className="dot-list">
                            <li><strong>HR:</strong> Employee docs & employment policies</li>
                            <li><strong>Secretarial:</strong> Shareholder & Investor documents</li>
                            <li><strong>Functions:</strong> R&D, Finance, & CX content</li>
                        </ul>
                    </div>
                    <div className="industry-block">
                        <div className="icon-main" style={{ color: 'var(--primary)' }}><i className="fas fa-university"></i></div>
                        <h3>BFSI</h3>
                        <ul className="dot-list">
                            <li><strong>Banking:</strong> Account opening & commercial lending</li>
                            <li><strong>Insurance:</strong> New policies & policy servicing</li>
                            <li><strong>Management:</strong> Claims & service requests</li>
                        </ul>
                    </div>
                    <div className="industry-block">
                        <div className="icon-main" style={{ color: 'var(--primary)' }}><i className="fas fa-landmark"></i></div>
                        <h3>Government</h3>
                        <ul className="dot-list">
                            <li><strong>Judiciary:</strong> Case File Digitization & e-Filing</li>
                            <li><strong>Ministries:</strong> Automation & grant management</li>
                            <li><strong>Public:</strong> Citizens records repositories</li>
                        </ul>
                    </div>
                    <div className="industry-block">
                        <div className="icon-main" style={{ color: 'var(--primary)' }}><i className="fas fa-graduation-cap"></i></div>
                        <h3>Education</h3>
                        <ul className="dot-list">
                            <li><strong>Libraries:</strong> Research, Journals, & Archives</li>
                            <li><strong>Institutions:</strong> Subject Text Repositories</li>
                            <li><strong>Access:</strong> Managed student records portal</li>
                        </ul>
                    </div>
                    <div className="industry-block">
                        <div className="icon-main" style={{ color: 'var(--primary)' }}><i className="fas fa-hospital"></i></div>
                        <h3>Healthcare</h3>
                        <ul className="dot-list">
                            <li><strong>Records:</strong> Patient records digitization</li>
                            <li><strong>Appointments:</strong> Easy access management</li>
                            <li><strong>Claims:</strong> Insurance history & history tracking</li>
                        </ul>
                    </div>
                    <div className="industry-block" style={{ background: 'var(--primary)', color: 'white' }}>
                        <div className="icon-main" style={{ color: 'white' }}><i className="fas fa-rocket"></i></div>
                        <h3>Startups</h3>
                        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Scaling with expansive dreams? Move your documentation to a secure, cloud-ready environment today.</p>
                    </div>
                </div>
            </div>

        </>
    );
};

export const Resources = () => (
    <>
        <PageHero
            title="Resources & Insights"
            subtitle="Everything you need to master your document lifecycle."
            bgImage="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2340&auto=format&fit=crop"
        />
        <section className="max-container reveal" style={{ padding: '100px 0' }}>
            <div className="feature-small-grid">
                <div className="feature-small-card">
                    <h4>Technical Docs</h4>
                    <p>Full API documentation and setup guides for developers.</p>
                    <Link to="#" className="link-more">Access Docs →</Link>
                </div>
                <div className="feature-small-card">
                    <h4>Case Studies</h4>
                    <p>Learn how Hero Motocorp saved 40% on operational costs.</p>
                    <Link to="#" className="link-more">Read Stories →</Link>
                </div>
                <div className="feature-small-card">
                    <h4>Help Center</h4>
                    <p>24/7 ticket support and community knowledge base.</p>
                    <Link to="#" className="link-more">Get Support →</Link>
                </div>
            </div>
        </section>

    </>
);

export const Pricing = () => (
    <>
        <div style={{ background: 'var(--section-alt)', paddingBottom: '100px' }}>
            <PageHero
                title="Pricing Plans"
                subtitle="Flexible options for growing businesses and enterprises."
                bgImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2340&auto=format&fit=crop"
            />
            <div className="max-container reveal" style={{ marginTop: '-60px' }}>
                <div className="pricing-grid">
                    <div className="pricing-card">
                        <h5>Standard</h5>
                        <div className="price">$49<span>/mo</span></div>
                        <ul>
                            <li>Up to 10,000 Documents</li>
                            <li>Basic Workflow Engine</li>
                            <li>5 User Accounts</li>
                            <li>Standard Support</li>
                        </ul>
                        <button className="btn-outline">Choose Plan</button>
                    </div>
                    <div className="pricing-card featured">
                        <div className="popular-tag">Most Popular</div>
                        <h5>Professional</h5>
                        <div className="price">$199<span>/mo</span></div>
                        <ul>
                            <li>Up to 500,000 Documents</li>
                            <li>Advanced AI Capture</li>
                            <li>25 User Accounts</li>
                            <li>Priority 24/7 Support</li>
                        </ul>
                        <button className="btn-primary">Choose Plan</button>
                    </div>
                    <div className="pricing-card">
                        <h5>Enterprise</h5>
                        <div className="price">Custom</div>
                        <ul>
                            <li>Unlimited Documents</li>
                            <li>Full API Access</li>
                            <li>Unlimited Users</li>
                            <li>Dedicated Success Manager</li>
                        </ul>
                        <button className="btn-outline">Contact Sales</button>
                    </div>
                </div>
            </div>
        </div>

    </>
);

export const Contact = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in'));
    }, []);
    const [formData, setFormData] = React.useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [error, setError] = React.useState(false);

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        setSending(true);
        setError(false);
        const success = await handleFormSubmission(formData, DEFAULTS.recipientEmail);
        if (success) {
            setSubmitted(true);
        } else {
            setError(true);
        }
        setSending(false);
    };

    return (
        <>
            <SEO
                title="Contact Us – Reach VSDOX & Vir Softech ECM Experts | India"
                description="Contact Vir Softech for VSDOX enterprise content management inquiries. Corporate office in Noida, India. International offices in Japan & USA. Email, phone & WhatsApp available."
                keywords="contact VSDOX, Vir Softech contact, ECM support India, document management inquiry, DMS sales contact, DMS, Document Management System, ECM, Enterprise Content Management System, AI-powered document management, Secure ECM, Scalable Enterprise Content Management, Intelligent capture, Seamless integration, Lifecycle automation, Advanced search, Digital operations, Content platform, Cloud-based centralized repository, Version control, Auditability, Approval workflows, Electronic DMS, Workflow automation, Records Management, Content lifecycle management, API integration, Document classification"
            />
            <PageHero
                title="Contact Us"
                subtitle="Get in touch with our document management experts."
                bgImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2340&auto=format&fit=crop"
            />
            <section className="max-container reveal contact-section">
                <div className="contact-page-grid">
                    <div className="contact-form-wrapper glass-card">
                        {submitted ? (
                            <div className="contact-success">
                                <div className="contact-success-icon"><i className="fas fa-check-circle"></i></div>
                                <h3 className="contact-success-title">Message Sent!</h3>
                                <p className="contact-success-message">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="btn-primary contact-success-action">Send Another</button>
                            </div>
                        ) : (
                            <>
                                <h3>Send us a Message</h3>
                                {error && (
                                    <div className="contact-error-box">
                                        Oops! Something went wrong. Please try again.
                                    </div>
                                )}
                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="contact-form-row">
                                        <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                                        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <input name="subject" type="text" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
                                    <textarea name="message" placeholder="Your Message" rows="6" value={formData.message} onChange={handleChange} required></textarea>
                                    <button type="submit" className="btn-primary contact-submit-btn" disabled={sending}>
                                        {sending ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    <div className="contact-info-boxes">
                        <div className="contact-box glass-card">
                            <h4>Corporate Office (HQ)</h4>
                            <p>Vir Softech Pvt. Ltd.<br />A 306, The I Thum, Plot No. A 40, Sector 62, Noida, UP, India</p>
                        </div>
                        <div className="contact-box glass-card">
                            <h4>International Offices</h4>
                            <p><strong>Japan:</strong> West Bldg. 302, 3-26-8 Takaido Higashi, Suginami-ku, Tokyo</p>
                            <p><strong>USA:</strong> Silicon Valley, California</p>
                        </div>
                        <div className="contact-box glass-card">
                            <h4>Phone & Email</h4>
                            <div className="contact-details">
                                <p><strong>Toll-Free:</strong> <a href={LINKS.telTollFree}>{APP_CONTACT.tollFree}</a></p>
                                <p><strong>Landline:</strong> <a href={LINKS.telLandline}>{APP_CONTACT.landline}</a></p>
                                <p><strong>WhatsApp:</strong> <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">{APP_CONTACT.whatsapp}</a></p>
                                <p><strong>Email:</strong> <a href={LINKS.mailToRecipient}>{APP_CONTACT.recipientEmail}</a></p>
                            </div>
                        </div>
                        <div className="contact-box glass-card">
                            <h4>Registered Office</h4>
                            <p>C-2/54, Ashok Vihar, Phase-II, North West, New Delhi, India – 110052</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};



export const Legal = () => (
    <>
        <PageHero
            title="Legal & Privacy"
            subtitle="Transparent terms of service and security commitments."
            bgImage="https://images.unsplash.com/photo-1589216532372-1c2a367900d9?q=80&w=2340&auto=format&fit=crop"
        />
        <section className="max-container reveal" style={{ padding: '100px 0' }}>
            <div className="legal-content glass-card">
                <h3>Privacy Policy</h3>
                <p>Effective Date: January 1, 2025</p>
                <p>
                    At VSDox, we are committed to protecting your privacy. This policy outlines how we handle your data and documents...
                </p>
                <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                <h3>Terms of Service</h3>
                <p>
                    By using VSDox, you agree to comply with our acceptable use policies. We provide a 99.9% uptime guarantee for all professional tier accounts...
                </p>
            </div>
        </section>

    </>
);

export const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in'));
    }, []);

    const achievementList = [
        "Showcase Start-up - India International Trade Fair 2016",
        "Top 20 ECM Solution Providers 2018, 2019, 2021, 2023 (CIO India)",
        "Most Promising Assessment Solution Provider 2021 (Ardorcomm Media)",
        "Partner - World Education Summit 2018"
    ];

    const leadership = [
        {
            name: "Deepak Garg",
            role: "Managing Director",
            img: "https://www.virsoftech.com/img/deepak_garg.jpg",
            linkedin: "https://www.linkedin.com/in/deepakgarg76/",
            email: "deepak.garg@virsoftech.com",
            desc: "A gifted techno-businessman with over 20 years of experience in product innovation, strategic planning, and customer acquisition. Previously at HCL Technologies and Adobe Systems, Deepak is the mind behind our products and services. As Managing Director, he oversees sales, business development, operations, and the financial division across global markets."
        },
        {
            name: "Abhijeet Jain",
            role: "Chief Technology Officer",
            img: "https://www.virsoftech.com/img/abhijeet_pic.jpg",
            linkedin: "https://www.linkedin.com/in/abhijeet-jain-5a9b313/",
            email: "abhijeet.jain@virsoftech.com",
            desc: "A Computer Scientist, Entrepreneur, and Business Executive with over 20 years of R&D leadership at global product companies. Previously at Adobe Systems as key solution architect for PDF-centric products in Print & Publishing. A contributor to PDF ISO specifications, Abhijeet remains hands-on with coding and serves as chief architect for our print domain projects."
        },
        {
            name: "Pralaypati Ta",
            role: "Principal Architect",
            img: "https://www.virsoftech.com/img/Pralay-photo.png",
            linkedin: "https://www.linkedin.com/in/pralaypati-ta-3944691/",
            email: "pralaypati.ta@virsoftech.com",
            desc: "A coding geek with over 18 years of tech leadership experience leading R&D teams at global product companies like Samsung and Adobe Systems. Pralaypati is our solution architect for cloud-based solutions in DAM/CMS and analytics technologies, driving innovation in platform architecture for enterprise-scale content management and digital asset solutions."
        },
        {
            name: "Sameer Manuja",
            role: "Principal Architect",
            img: "https://www.virsoftech.com/sameer_manuja.jpg",
            linkedin: "https://www.linkedin.com/in/sameermanuja/",
            email: "sameer.manuja@virsoftech.com",
            desc: "Our key solution architect for print and publishing technologies with over 20 years of industry experience creating path-setting innovations at Samsung and Adobe Systems. Sameer holds several US patents to his name and drives the architecture of our advanced print domain solutions, rendering engines, and document processing frameworks."
        },
        {
            name: "Akihide Sugino",
            role: "Country Head, Japan",
            img: "https://www.virsoftech.com/img/sugino.jpg",
            linkedin: "#",
            email: "sugino.ak@virsoftech.com",
            desc: "A seasoned industry veteran with over 35 years of experience in sales, marketing, and license compliance at top global firms including Epson and Adobe. Sugino has managed vendor partnerships, product line development, and enterprise sales for print and publishing. He oversees corporate management and Japan operations at Vir Softech."
        },
        {
            name: "Manu Paliwal",
            role: "Vice President – Sales",
            img: "https://www.virsoftech.com/img/manu-photo.jpg?v=1",
            linkedin: "https://www.linkedin.com/in/manu-paliwal-159b324/",
            email: APP_CONTACT.recipientEmail,
            desc: "Driving growth strategy, differentiated customer value, and expanding business reach with digital solutions. With over 25 years of experience in sales, marketing, and strategic alliances, Manu has delivered turnaround results in challenging business situations. Previously he held P&L leadership roles at global companies including President – Business Solutions for Sharp."
        }
    ];

    return (
        <>
            <SEO
                title="About Vir Softech – India's Leading ECM & DMS Technology Company"
                description="Vir Softech Pvt. Ltd. is an ISO 9001:2015 certified, CMMI Level 3 company delivering AI-powered document management solutions to 500+ clients globally since 1995."
                keywords="Vir Softech, about VSDOX, ECM company India, DMS provider, ISO certified document management, CMMI Level 3, DMS, Document Management System, ECM, Enterprise Content Management System, AI-powered document management, Secure ECM, Scalable Enterprise Content Management, Intelligent capture, Seamless integration, Lifecycle automation, Advanced search, Digital operations, Content platform, Cloud-based centralized repository, Version control, Auditability, Approval workflows, Electronic DMS, Records Management, Content lifecycle management, API integration, Document classification"
            />
            <PageHero
                title="About Vir Softech"
                subtitle="Business-led IT process transformation for a digital world."
                bgImage={teamBanner}
            />

            <section className="section max-container reveal" style={{ padding: '80px 0' }}>
                <div className="section-info">
                    <div className="info-text">
                        <span className="info-tag">WHO WE ARE</span>
                        <h2>Revolutionizing IT Process Transformation</h2>
                        <p>
                            Vir Softech is at the forefront of the revolution in business-led IT process transformation. We assist our customers in realizing their vision and scaling up through workflow transformations that produce superior business results at the lowest possible cost and in the shortest amount of time.
                        </p>
                        <p>
                            We are a tech leader in four key domains:
                        </p>
                        <ul className="info-list">
                            <li><i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> Enterprise Content Management & Digital Imaging</li>
                            <li><i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> Print Technology Products & Services</li>
                            <li><i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> Design & Artwork Process Automation</li>
                            <li><i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginRight: '10px' }}></i> EVAL - Educational Evaluation, Assessments & Learning</li>
                        </ul>
                    </div>
                    <div className="info-image">
                        <div className="glass-card image-wrapper" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px' }}>
                            <h3 style={{ marginBottom: '20px', color: 'var(--primary)' }}>Global Impact</h3>
                            <p style={{ marginBottom: '10px' }}><strong>CAGR:</strong> 40% per annum</p>
                            <p style={{ marginBottom: '10px' }}><strong>Presence:</strong> US, UK, Japan, Australia, India</p>
                            <p><strong>Clients:</strong> Fortune 500, Govt, BFSI,Judiciary,Corporate, Health & Education</p>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ background: 'var(--section-alt)', padding: '0' }}>
                <MilestoneTimeline />

                <div className="max-container reveal">
                    <div style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '80px' }}>
                        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Awards & Recognition</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                            {achievementList.map((ach, i) => (
                                <div key={i} style={{ background: '#f8fafc', padding: '15px 25px', borderRadius: '50px', fontSize: '14px', fontWeight: '600', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-award" style={{ color: 'var(--primary)' }}></i> {ach}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0', background: '#f8fafc' }}>
                <div className="max-container reveal">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <span className="info-tag">OUR TEAM</span>
                        <h2 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '16px' }}>Leadership at Vir Softech</h2>
                        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                            A few passionate technologists behind world's foremost enterprise Imaging and Print products formed Vir Softech in Nov 2015. With time the team has expanded to include brilliant product engineers, research scientists, programmers, workflow engineers, data scientists, marketing executives, and dev-ops experts.
                        </p>
                    </div>
                    <div className="leadership-grid">
                        {leadership.map((leader, i) => (
                            <div key={i} className="leader-card">
                                <div className="leader-card-top">
                                    <div className="leader-photo">
                                        <img src={leader.img} alt={leader.name}
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Leader" }} />
                                    </div>
                                    <h4 className="leader-name">{leader.name}</h4>
                                    <div className="leader-role">{leader.role}</div>
                                    <div className="leader-socials">
                                        <a href={leader.linkedin} target="_blank" rel="noopener noreferrer" className="leader-social-btn linkedin">
                                            <i className="fab fa-linkedin-in"></i>
                                        </a>
                                        <a href={`mailto:${leader.email}`} className="leader-social-btn email">
                                            <i className="fas fa-envelope"></i>
                                        </a>
                                    </div>
                                </div>
                                <p className="leader-desc">{leader.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

