import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { handleFormSubmission } from '../utils/formHandler';


const RequestDemo = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        designation: '',
        industry: '',
        employees: '',
        interest: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(false);


    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setSending(true);
        setError(false);

        const success = await handleFormSubmission(form, 'corp@virsoftech.com');

        if (success) {
            setSubmitted(true);
        } else {
            setError(true);
            // Fallback: still show success to user if service is blocked but let them know it might have failed?
            // Actually, better to show an error message.
        }
        setSending(false);
    };


    const features = [
        { icon: 'fa-robot', title: 'AI-Powered ECM', desc: 'See VSDOX AI features live — summarization, RAG Q&A, metadata extraction & more.' },
        { icon: 'fa-diagram-project', title: 'Workflow Automation', desc: 'Watch how static, dynamic & hierarchical workflows operate in real-time.' },
        { icon: 'fa-magnifying-glass', title: 'Intelligent Search', desc: 'Phonetic, fuzzy, multilingual and voice-based search demonstrated live.' },
        { icon: 'fa-shield-halved', title: 'Enterprise Security', desc: 'AES-256 encryption, MFA, RBAC & LDAP integration — all shown in action.' },
    ];

    const industries = [
        'Banking & BFSI', 'Healthcare', 'Government', 'Judiciary',
        'Education', 'Corporate', 'Manufacturing', 'Other'
    ];

    const employeeRanges = ['1–50', '51–200', '201–500', '501–1000', '1000+'];

    const interests = [
        'Document Management System (DMS)',
        'Workflow & Process Automation',
        'AI-Powered Features (RAG, Summarization)',
        'Capture & Digitization Solution',
        'Multilingual Search & OCR',
        'Full VSDOX Platform Overview',
    ];

    const trustStats = [
        { number: '200M+', label: 'Documents Processed' },
        { number: '500+', label: 'Enterprise Clients' },
        { number: '99.9%', label: 'Platform Uptime' },
        { number: '24hrs', label: 'Demo Response Time' },
    ];

    return (
        <main>
            {/* Hero */}
            <section className="section-padding" style={{
                backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(29,99,237,0.85) 100%), url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2340&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                marginTop: '80px',
                textAlign: 'center',
            }}>
                <div className="max-container">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '30px', padding: '6px 18px', marginBottom: '24px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                        <span style={{ color: '#60a5fa', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Demo Available</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: '900', color: 'white', marginBottom: '20px', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                        See VSDOX in Action
                    </h1>
                    <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: 'rgba(255,255,255,0.85)', maxWidth: '680px', margin: '0 auto 40px', lineHeight: '1.7' }}>
                        Get a personalized, live walkthrough of our AI-powered Enterprise Content Management platform — tailored to your industry and use case.
                    </p>
                    {/* Stats */}
                    <div className="stats-grid-inline" style={{ justifyContent: 'center' }}>
                        {trustStats.map((s, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: '900', color: '#60a5fa' }}>{s.number}</div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content — split layout */}
            <section className="section-padding" style={{ background: '#f8fafc' }}>
                <div className="max-container">
                    <div className="two-col-grid" style={{ alignItems: 'start' }}>

                        {/* Left — Info Panel */}
                        <div>
                            <h2 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.02em' }}>What You'll See in the Demo</h2>
                            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: '1.8', marginBottom: '40px' }}>
                                Our product experts will walk you through the VSDOX platform live, focusing specifically on the features and workflows most relevant to your organization.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
                                {features.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '18px', padding: '24px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1d63ed'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(29,99,237,0.1)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(29,99,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#1d63ed', flexShrink: 0 }}>
                                            <i className={`fas ${f.icon}`}></i>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>{f.title}</h4>
                                            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Contact alternative */}
                            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '20px', padding: '32px', color: 'white' }}>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>Prefer to Talk Directly?</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <a href="mailto:corp@virsoftech.com" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#60a5fa', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
                                        <i className="fas fa-envelope" style={{ width: '20px' }}></i>
                                        corp@virsoftech.com
                                    </a>
                                    <a href="tel:18005717711" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#60a5fa', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
                                        <i className="fas fa-phone" style={{ width: '20px' }}></i>
                                        1800-571-7711 (Toll Free)
                                    </a>
                                    <a href="https://wa.me/919319086751" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#25D366', textDecoration: 'none', fontSize: '15px', fontWeight: '600' }}>
                                        <i className="fab fa-whatsapp" style={{ width: '20px' }}></i>
                                        WhatsApp: +91 9319086751
                                    </a>
                                </div>
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px' }}>
                                    <Link to="/contact" style={{ flex: 1, textAlign: 'center', background: '#1d63ed', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}>Contact Us</Link>
                                    <Link to="/case-studies" style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>Case Studies</Link>
                                </div>
                            </div>
                        </div>

                        <div>
                            {!submitted ? (
                                <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(24px, 5vw, 48px)', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', marginBottom: '8px' }}>Book Your Free Demo</h3>
                                    <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '32px' }}>Fill in your details and our team will reach out within 24 hours.</p>

                                    {error && (
                                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
                                            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                                            Oops! Something went wrong. Please try again or email us directly at corp@virsoftech.com.
                                        </div>
                                    )}


                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {/* Name row */}
                                        <div className="two-col-grid" style={{ gap: '16px' }}>
                                            <div>
                                                <label style={labelStyle}>First Name *</label>
                                                <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} placeholder="Rajesh" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Last Name *</label>
                                                <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} placeholder="Kumar" />
                                            </div>
                                        </div>

                                        {/* Email & Phone */}
                                        <div className="two-col-grid" style={{ gap: '16px' }}>
                                            <div>
                                                <label style={labelStyle}>Work Email *</label>
                                                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="rajesh@company.com" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Phone Number *</label>
                                                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required style={inputStyle} placeholder="+91 98765 43210" />
                                            </div>
                                        </div>

                                        {/* Org & Designation */}
                                        <div className="two-col-grid" style={{ gap: '16px' }}>
                                            <div>
                                                <label style={labelStyle}>Organization *</label>
                                                <input name="organization" value={form.organization} onChange={handleChange} required style={inputStyle} placeholder="Organization name" />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Your Designation</label>
                                                <input name="designation" value={form.designation} onChange={handleChange} style={inputStyle} placeholder="e.g. IT Manager" />
                                            </div>
                                        </div>

                                        {/* Industry & Employees */}
                                        <div className="two-col-grid" style={{ gap: '16px' }}>
                                            <div>
                                                <label style={labelStyle}>Industry *</label>
                                                <select name="industry" value={form.industry} onChange={handleChange} required style={inputStyle}>
                                                    <option value="">Select industry</option>
                                                    {industries.map((ind, i) => <option key={i} value={ind}>{ind}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label style={labelStyle}>No. of Employees</label>
                                                <select name="employees" value={form.employees} onChange={handleChange} style={inputStyle}>
                                                    <option value="">Select range</option>
                                                    {employeeRanges.map((r, i) => <option key={i} value={r}>{r}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Interest */}
                                        <div>
                                            <label style={labelStyle}>Area of Interest *</label>
                                            <select name="interest" value={form.interest} onChange={handleChange} required style={inputStyle}>
                                                <option value="">Select what you'd like to see</option>
                                                {interests.map((item, i) => <option key={i} value={item}>{item}</option>)}
                                            </select>
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label style={labelStyle}>Additional Requirements</label>
                                            <textarea name="message" value={form.message} onChange={handleChange} rows={4} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} placeholder="Tell us about your current document management challenges or specific requirements..." />
                                        </div>

                                        <button type="submit" disabled={sending} style={{
                                            background: 'linear-gradient(135deg, #1d63ed 0%, #7c3aed 100%)',
                                            color: 'white',
                                            padding: '18px 32px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: '800',
                                            cursor: sending ? 'wait' : 'pointer',
                                            transition: 'all 0.3s ease',
                                            letterSpacing: '0.3px',
                                            opacity: sending ? 0.7 : 1,
                                        }}
                                            onMouseEnter={e => { if (!sending) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(29,99,237,0.4)'; } }}
                                            onMouseLeave={e => { if (!sending) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; } }}
                                        >
                                            {sending ? (
                                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                                            ) : (
                                                <i className="fas fa-calendar-check" style={{ marginRight: '10px' }}></i>
                                            )}
                                            {sending ? 'Sending...' : 'Request My Free Demo'}
                                        </button>


                                        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                                            <i className="fas fa-lock" style={{ marginRight: '6px' }}></i>
                                            Your data is secure and will never be shared with third parties.
                                        </p>
                                    </form>
                                </div>
                            ) : (
                                // Success State
                                <div style={{ background: 'white', borderRadius: '24px', padding: '64px 48px', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1d63ed, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px', color: 'white', margin: '0 auto 28px' }}>
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <h3 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', marginBottom: '16px' }}>Demo Request Sent!</h3>
                                    <p style={{ fontSize: '17px', color: '#64748b', lineHeight: '1.7', marginBottom: '12px' }}>
                                        Thank you, <strong style={{ color: '#0f172a' }}>{form.firstName}</strong>! Our team will reach out to <strong style={{ color: '#1d63ed' }}>{form.email}</strong> within 24 hours to schedule your personalized VSDOX demo.
                                    </p>
                                    <p style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '40px' }}>In the meantime, explore our case studies and solution pages.</p>
                                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                        <Link to="/case-studies" style={{ background: '#1d63ed', color: 'white', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>View Case Studies</Link>
                                        <Link to="#" style={{ background: '#f1f5f9', color: '#0f172a', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>Explore VSDOX</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust bar */}
            <section style={{ background: '#0f172a', padding: '48px 0' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>Trusted by Leaders Across Sectors</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {['Government Ministries', 'High Courts', 'Banking & BFSI', 'Healthcare Institutions', 'Universities & Archives', 'Presidential Estate'].map((org, i) => (
                            <span key={i} style={{ color: '#475569', fontWeight: '700', fontSize: '14px', padding: '8px 20px', border: '1px solid #1e293b', borderRadius: '30px' }}>{org}</span>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

// Shared styles
const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '15px',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
};

export default RequestDemo;
