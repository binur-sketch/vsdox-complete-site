import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';


/* ── Shared hero banner ─────────────────────────────────── */
const PageHero = ({ title, subtitle, tag, bgColor, bgImage }) => (
    <section style={{
        backgroundImage: bgImage
            ? `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url(${bgImage})`
            : (bgColor || 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)'),
        backgroundColor: '#0f172a',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '160px 0 100px',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '80px'
    }}>
        {/* decoration circles */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'rgba(29,99,237,0.08)', top: '-200px', right: '-100px', zIndex: 0 }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(96,165,250,0.06)', bottom: '-150px', left: '-80px', zIndex: 0 }} />
        <div className="max-container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="page-hero-content reveal">
                {tag && (
                    <span style={{
                        display: 'inline-block', background: 'rgba(29,99,237,0.2)', color: '#60a5fa',
                        fontSize: '12px', fontWeight: '700', letterSpacing: '0.12em',
                        padding: '6px 14px', borderRadius: '100px', marginBottom: '20px',
                        border: '1px solid rgba(96,165,250,0.3)'
                    }}>{tag}</span>
                )}
                <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: '900', color: 'white', marginBottom: '20px', lineHeight: 1.1 }}>{title}</h1>
                <p style={{ fontSize: 'clamp(15px, 2vw, 20px)', color: 'rgba(255,255,255,0.75)', maxWidth: '640px', lineHeight: 1.7, marginBottom: '36px' }}>{subtitle}</p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <Link to="/request-demo" className="btn-primary">Request a Demo</Link>
                    <Link to="/products" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', color: 'white', textDecoration: 'none', fontWeight: '600', transition: 'all 0.3s ease' }}>Explore Platform</Link>
                </div>
            </div>
        </div>
    </section>
);

/* ── Stats strip ────────────────────────────────────────── */
const StatsStrip = ({ stats }) => (
    <div className="trust-full-width-strip">
        <div className="max-container">
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: '20px', textAlign: 'center' }}>
                {stats.map((s, i) => (
                    <div key={i} style={{ padding: '20px' }}>
                        <div className="stat-number">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/* ── Feature card grid ──────────────────────────────────── */
const FeatureGrid = ({ features }) => (
    <div className="ai-features-grid" style={{ marginTop: '50px' }}>
        {features.map((f, i) => (
            <div key={i} className="ai-feature-card">
                <div className="ai-icon"><i className={`fas ${f.icon}`}></i></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
            </div>
        ))}
    </div>
);

/* ── Benefits list ──────────────────────────────────────── */
const BenefitsList = ({ benefits, title, desc }) => (
    <section style={{ padding: '100px 0', background: '#f8fafc' }}>
        <div className="max-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '80px' }}>
                <div className="reveal">
                    <span className="info-tag">Key Outcomes</span>
                    <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', margin: '16px 0 20px', color: 'var(--text-dark)' }}>{title}</h2>
                    <p style={{ fontSize: '17px', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '32px' }}>{desc}</p>
                    <Link to="/contact" className="btn-primary">Talk to an Expert</Link>
                </div>
                <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {benefits.map((b, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '16px',
                            background: 'white', padding: '20px 24px', borderRadius: '14px',
                            border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0,0,0,0.03)',
                            transition: 'all 0.3s ease'
                        }}>
                            <span style={{ background: 'rgba(29,99,237,0.1)', color: 'var(--primary)', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                                <i className={`fas ${b.icon}`}></i>
                            </span>
                            <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px' }}>{b.title}</div>
                                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>{b.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

/* ── CTA Banner ─────────────────────────────────────────── */
const CTABanner = ({ title, subtitle }) => (
    <section className="cta-section reveal">
        <div className="max-container" style={{ textAlign: 'center' }}>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }}>Contact Us Now</Link>
                <Link to="/case-studies" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.4)', color: 'white', textDecoration: 'none', fontWeight: '600' }}>View Case Studies</Link>
            </div>
        </div>
    </section>
);


/* ═══════════════════════════════════════════════════════════
   BANKING & BFSI
   ═══════════════════════════════════════════════════════════ */
export const BankingBFSI = () => {
    useEffect(() => { window.scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in')); }, []);
    return (
        <>
            <PageHero
                tag="INDUSTRY SOLUTION · BFSI"
                title="Document Intelligence for Banking & Financial Services"
                subtitle="Accelerate loan processing, ensure regulatory compliance, and digitize operations with an enterprise-grade ECM platform trusted by leading banks and insurers."
                bgImage="https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=2400&auto=format&fit=crop"
            />

            <StatsStrip stats={[
                { value: '70%', label: 'Faster Loan Processing' },
                { value: '99.9%', label: 'Regulatory Compliance Rate' },
                { value: '50M+', label: 'Financial Documents Managed' },
                { value: '40%', label: 'Reduction in Operational Cost' }
            ]} />

            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '100px 0' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
                        <span className="info-tag" style={{ background: 'rgba(29,99,237,0.15)', color: '#60a5fa', border: '1px solid rgba(29,99,237,0.2)' }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', color: 'white', margin: '20px 0' }}>End-to-End BFSI Document Management</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto', fontSize: '17px' }}>From onboarding to archival, manage every financial document lifecycle on a single secure platform.</p>
                    </div>
                    <FeatureGrid features={[
                        { icon: 'fa-file-invoice', title: 'Loan & Mortgage Processing', desc: 'Automate document ingestion, indexing, and verification for retail and commercial lending workflows.' },
                        { icon: 'fa-shield-halved', title: 'Regulatory Compliance', desc: 'Built-in audit trails, retention policies, and access controls aligned with RBI, SEBI, and IRDAI guidelines.' },
                        { icon: 'fa-address-card', title: 'KYC & Account Opening', desc: 'Digitize KYC, form handling, and new account onboarding with intelligent data extraction from IDs.' },
                        { icon: 'fa-file-contract', title: 'Insurance Policy Management', desc: 'Manage new policies, endorsements, claims documents, and service requests in one unified repository.' },
                        { icon: 'fa-magnifying-glass-chart', title: 'Fraud Detection & Analytics', desc: 'AI-powered anomaly detection and document verification to prevent fraudulent claims and transactions.' },
                        { icon: 'fa-lock', title: 'AES-256 Encrypted Vault', desc: 'Bank-grade encryption, multi-factor authentication, and role-based data access for maximum security.' },
                    ]} />
                </div>
            </section>

            <BenefitsList
                title="Measurable Business Impact"
                desc="Organizations in the BFSI sector using VSDOX have transformed their document operations, reducing processing time and compliance risk dramatically."
                benefits={[
                    { icon: 'fa-clock', title: 'Faster Customer Onboarding', desc: 'Reduce account opening time from days to hours with automated KYC and digital verification.' },
                    { icon: 'fa-circle-check', title: 'Zero Compliance Gaps', desc: 'Automated retention policies and regulatory reporting ensure zero audit findings.' },
                    { icon: 'fa-cloud', title: 'Cloud & On-Premise Flexibility', desc: 'Deploy on AWS, Azure, or on-premise to meet your data residency requirements.' },
                    { icon: 'fa-arrows-rotate', title: 'Seamless Core Banking Integration', desc: 'Native connectors for Finacle, Temenos, SAP BFSI, and other core banking systems.' },
                ]}
            />

            <section style={{ padding: '80px 0', background: 'white' }} className="reveal">
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                        <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800' }}>Use Cases Across BFSI</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                        {['Retail Banking: Account opening forms, KYC, credit cards', 'Commercial Lending: Loan origination, collateral, risk docs', 'Insurance: Claims, policy servicing, underwriting files', 'Investment Banking: Trade confirmations, mandates, reports', 'NBFCs: Microfinance application & disbursement records', 'Pension Fund Management: NPS onboarding, contribution & workflow automation', 'Compliance: CERSAI, CKYC, RBI audit documentation'].map((uc, i) => (
                            <div key={i} className="feature-v3-card">
                                <i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginBottom: '12px', display: 'block' }}></i>
                                <p style={{ color: 'var(--text-main)', fontWeight: '500' }}>{uc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner title="Ready to Modernize Your BFSI Operations?" subtitle="Join leading banks and insurers digitizing their document workflows with VSDOX." />

        </>
    );
};


/* ═══════════════════════════════════════════════════════════
   HEALTHCARE
   ═══════════════════════════════════════════════════════════ */
export const Healthcare = () => {
    useEffect(() => { window.scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in')); }, []);
    return (
        <>
            <PageHero
                tag="INDUSTRY SOLUTION · HEALTHCARE"
                title="Secure Patient Records & Clinical Document Management"
                subtitle="Digitize patient files, streamline clinical operations, and ensure HIPAA-compliant document handling across hospitals, clinics, and insurance providers."
                bgImage="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2400&auto=format&fit=crop"
            />

            <StatsStrip stats={[
                { value: '5M+', label: 'Patient Records Digitized' },
                { value: '85%', label: 'Faster Record Retrieval' },
                { value: '100%', label: 'HIPAA Compliance Ready' },
                { value: '60%', label: 'Reduced Paper Storage Cost' }
            ]} />

            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '100px 0' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
                        <span className="info-tag" style={{ background: 'rgba(29,99,237,0.15)', color: '#60a5fa', border: '1px solid rgba(29,99,237,0.2)' }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', color: 'white', margin: '20px 0' }}>Intelligent Healthcare Document Platform</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto', fontSize: '17px' }}>From patient intake to discharge summaries, manage every clinical document securely and efficiently.</p>
                    </div>
                    <FeatureGrid features={[
                        { icon: 'fa-notes-medical', title: 'Patient Record Management', desc: 'Centralized, searchable repository for patient histories, lab results, imaging reports, and discharge summaries.' },
                        { icon: 'fa-file-medical', title: 'Clinical Document Digitization', desc: 'Convert paper-based clinical records to structured digital formats with multilingual OCR and AI extraction.' },
                        { icon: 'fa-hospital', title: 'Insurance Claims Processing', desc: 'Automate claim submission workflows with intelligent document validation and status tracking.' },
                        { icon: 'fa-user-doctor', title: 'Appointment & Referral Docs', desc: 'Digitize referral letters, prescriptions, and appointment records for seamless care coordination.' },
                        { icon: 'fa-shield-halved', title: 'HIPAA & Data Security', desc: 'Role-based access, audit logs, and encrypted storage to protect sensitive patient health information.' },
                        { icon: 'fa-qrcode', title: 'QR-Code Patient Records', desc: 'Enable secure, instant access to patient records via unique QR codes at point of care.' },
                    ]} />
                </div>
            </section>

            <BenefitsList
                title="Transforming Patient Care Through Digital Records"
                desc="Healthcare organizations using VSDOX improve care quality by having the right documents at the right time — securely, efficiently, and in compliance."
                benefits={[
                    { icon: 'fa-bolt', title: 'Instant Record Access', desc: 'Retrieve any patient record in seconds with full-text and metadata search.' },
                    { icon: 'fa-hospital-user', title: 'Improved Patient Safety', desc: 'Reduce medical errors with accurate, always-accessible patient history.' },
                    { icon: 'fa-money-bill-wave', title: 'Faster Insurance Reimbursement', desc: 'Automate claims documentation to reduce reimbursement timelines by 60%.' },
                    { icon: 'fa-leaf', title: 'Paperless Hospital', desc: 'Eliminate paper-based workflows and reduce storage costs significantly.' },
                ]}
            />

            <CTABanner title="Digitize Your Healthcare Records Today" subtitle="Trusted by hospitals, clinics, and health insurers across India. Let's transform your care delivery." />

        </>
    );
};


/* ═══════════════════════════════════════════════════════════
   Corporate
   ═══════════════════════════════════════════════════════════ */
export const Corporate = () => {
    useEffect(() => { window.scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in')); }, []);
    return (
        <>
            <PageHero
                tag="INDUSTRY SOLUTION · Corporate"
                title="Smart Document Control for Modern Corporate"
                subtitle="Automate engineering document control, quality management records, and supply chain documentation to drive operational excellence across your plant floor."
                bgImage="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2400&auto=format&fit=crop"
            />

            <StatsStrip stats={[
                { value: '65%', label: 'Faster Document Approval' },
                { value: '80%', label: 'Reduction in Non-Conformances' },
                { value: '10TB+', label: 'Engineering Data Managed' },
                { value: '45%', label: 'Lower Audit Preparation Time' }
            ]} />

            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '100px 0' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
                        <span className="info-tag" style={{ background: 'rgba(29,99,237,0.15)', color: '#60a5fa', border: '1px solid rgba(29,99,237,0.2)' }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', color: 'white', margin: '20px 0' }}>Engineering & Manufacturing Document Control</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto', fontSize: '17px' }}>From BOMs and CAD drawings to quality certifications, manage every document in a structured, version-controlled environment.</p>
                    </div>
                    <FeatureGrid features={[
                        { icon: 'fa-drafting-compass', title: 'Engineering Document Control', desc: 'Version-controlled repository for CAD drawings, BOMs, manuals, and specifications with change-history tracking.' },
                        { icon: 'fa-certificate', title: 'Quality Management (QMS)', desc: 'Manage ISO 9001, IATF 16949, and AS9100 documentation with automated review and approval workflows.' },
                        { icon: 'fa-truck', title: 'Supply Chain Documentation', desc: 'Centralize vendor agreements, purchase orders, certificates of conformance, and material test reports.' },
                        { icon: 'fa-gears', title: 'Maintenance Records (CMMS)', desc: 'Digital maintenance logs, SOP management, and equipment history for preventive and predictive maintenance.' },
                        { icon: 'fa-clipboard-check', title: 'Compliance & Audit Readiness', desc: 'Always-audit-ready documentation with automated compliance checks and complete traceability.' },
                        { icon: 'fa-rotate', title: 'ERP & PLM Integration', desc: 'Seamless integration with SAP, Oracle, and Siemens PLM for unified data across your enterprise.' },
                    ]} />
                </div>
            </section>

            <BenefitsList
                title="Drive Operational Excellence on the Shop Floor"
                desc="Leading manufacturers trust VSDOX to maintain product quality, reduce downtime, and pass audits with confidence."
                benefits={[
                    { icon: 'fa-code-branch', title: 'Version Control & Change Management', desc: 'Never use an outdated drawing again. Enforce controlled document distribution.' },
                    { icon: 'fa-triangle-exclamation', title: 'ISO & IATF Compliance', desc: 'Out-of-the-box support for ISO 9001, IATF 16949, and other international quality standards.' },
                    { icon: 'fa-file-circle-check', title: 'Digital Work Instructions', desc: 'Deliver the right work instruction to the right operator at the right station, digitally.' },
                    { icon: 'fa-plug', title: 'ERP-Connected Document Flow', desc: 'Link documents to SAP production orders, materials, and assets for full traceability.' },
                ]}
            />

            <CTABanner title="Ready to Achieve Manufacturing Excellence?" subtitle="Global manufacturers trust Vir Softech for document control, quality, and compliance." />

        </>
    );
};


/* ═══════════════════════════════════════════════════════════
   EDUCATION
   ═══════════════════════════════════════════════════════════ */
export const Education = () => {
    useEffect(() => { window.scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in')); }, []);
    return (
        <>
            <PageHero
                tag="INDUSTRY SOLUTION · EDUCATION"
                title="Next-Generation Digital Archives for Academic Institutions"
                subtitle="Manage research repositories, student records, institutional archives, and library collections with an intelligent, scalable, open-source ECM platform."
                bgImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2400&auto=format&fit=crop"
            />

            <StatsStrip stats={[
                { value: '2M+', label: 'Academic Records Managed' },
                { value: '100+', label: 'Institutions Served' },
                { value: '90%', label: 'Reduction in Record Retrieval Time' },
            ]} />

            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '100px 0' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
                        <span className="info-tag" style={{ background: 'rgba(29,99,237,0.15)', color: '#60a5fa', border: '1px solid rgba(29,99,237,0.2)' }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', color: 'white', margin: '20px 0' }}>Academic Document & Repository Management</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto', fontSize: '17px' }}>A trusted platform powering digital transformation for IITs, AIIMs, universities, and research institutions.</p>
                    </div>
                    <FeatureGrid features={[
                        { icon: 'fa-book-open', title: 'Institutional Repositories', desc: 'Digital repository for research papers, theses, journals, and grey literature with DOI minting.' },
                        { icon: 'fa-graduation-cap', title: 'Student Records Management', desc: 'Secure, searchable management of admission forms, transcripts, certificates, and examination records.' },
                        { icon: 'fa-landmark', title: 'Library Digitization', desc: 'Convert rare books, maps, manuscripts, and physical archives into searchable, accessible digital assets.' },
                        { icon: 'fa-share-nodes', title: 'Knowledge Sharing & Discovery', desc: 'Enable cross-institutional knowledge sharing with OAI-PMH compliant open-access repositories.' },
                        { icon: 'fa-file-shield', title: 'Compliance & Accreditation Docs', desc: 'Manage NAAC, UGC, NBA, and NIRF documentation with automated compliance workflows.' },
                        { icon: 'fa-magnifying-glass', title: 'AI-Powered Academic Search', desc: 'Full-text semantic search across the entire institutional knowledge base in multiple languages.' },
                    ]} />
                </div>
            </section>

            <BenefitsList
                title="Empowering Academic Excellence Through Digital Transformation"
                desc="From the library basement to the cloud — VSDOX preserves, organizes, and makes accessible the institutional knowledge that shapes the future."
                benefits={[
                    { icon: 'fa-server', title: 'Scalable to Any Institution Size', desc: 'From small colleges to research universities managing terabytes of academic content.' },
                    { icon: 'fa-magnifying-glass-plus', title: 'Full-Text Search Across Languages', desc: 'Students and researchers find relevant content instantly with multilingual full-text indexing.' },
                    { icon: 'fa-universal-access', title: 'Open Access & Discovery', desc: 'Boost institutional visibility with OAI-PMH compatible open-access publishing.' },
                    { icon: 'fa-lock-open', title: 'No Proprietary Licensing Costs', desc: 'Open-source based platform eliminates expensive per-seat licensing for your institution.' },
                ]}
            />

            <section style={{ padding: '80px 0', background: 'white' }} className="reveal">
                <div className="max-container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', marginBottom: '16px' }}>Trusted by India's Premier Institutions</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '17px' }}>Including IIT Delhi, AIIMS New Delhi, and leading High Courts</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {['IIT Delhi', 'AIIMS New Delhi', 'National Archives', 'OCAC', 'IIC Delhi'].map((name, i) => (
                            <div key={i} style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 28px', fontWeight: '700', color: 'var(--text-dark)' }}>{name}</div>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner title="Preserve & Unlock Your Institution's Knowledge" subtitle="Build a world-class digital repository that serves students, researchers, and the public." />

        </>
    );
};


/* ═══════════════════════════════════════════════════════════
   GOVERNMENT
   ═══════════════════════════════════════════════════════════ */
export const Government = () => {
    useEffect(() => { window.scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in')); }, []);
    return (
        <>
            <PageHero
                tag="INDUSTRY SOLUTION · GOVERNMENT"
                title="Digital Document Governance for Public Sector Excellence"
                subtitle="Enable e-governance, digitize citizen records, and modernize judiciary and ministry document workflows with a secure, sovereign-grade ECM platform."
                bgImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2400&auto=format&fit=crop"
            />

            <StatsStrip stats={[
                { value: '50M+', label: 'Govt Records Digitized' },
                { value: '15+', label: 'High Courts Served' },
                { value: '99.9%', label: 'System Uptime' },
                { value: 'GeM', label: 'Government e-Marketplace Listed' }
            ]} />

            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '100px 0' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
                        <span className="info-tag" style={{ background: 'rgba(29,99,237,0.15)', color: '#60a5fa', border: '1px solid rgba(29,99,237,0.2)' }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', color: 'white', margin: '20px 0' }}>Sovereign-Grade Public Sector Document Management</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto', fontSize: '17px' }}>Trusted by High Courts, National Archives, Patents Office, and State Governments to digitize and manage critical public records.</p>
                    </div>
                    <FeatureGrid features={[
                        { icon: 'fa-gavel', title: 'Judiciary Case Management', desc: 'Digitize case files, court orders, and judgements for High Courts with structured e-filing workflows.' },
                        { icon: 'fa-landmark', title: 'Ministry & Secretariat Records', desc: 'Manage office files, notings, correspondence, and policy documents with multi-level approval workflows.' },
                        { icon: 'fa-id-card', title: 'Citizen Record Repositories', desc: 'Secure long-term digital preservation of birth certificates, land records, and civil registration documents.' },
                        { icon: 'fa-lightbulb', title: 'Patent & Intellectual Property', desc: 'Specialized workflows for patent application management, prior art search, and IPR documentation.' },
                        { icon: 'fa-money-bill-transfer', title: 'Grants & Procurement Management', desc: 'Streamline government tendering, vendor documentation, and grants disbursement record-keeping.' },
                        { icon: 'fa-shield-halved', title: 'Sovereign Security & Data Residency', desc: 'On-premise and private cloud deployment to meet data sovereignty and national security requirements.' },
                    ]} />
                </div>
            </section>

            <BenefitsList
                title="Powering e-Governance for a Digital India"
                desc="From the Cabinet Secretariat to the district court, VSDOX enables governments to serve citizens faster, more transparently, and more securely."
                benefits={[
                    { icon: 'fa-server', title: 'On-Premise Sovereignty', desc: 'Full on-premise deployment option for sensitive government data with no cloud dependency.' },
                    { icon: 'fa-gem', title: 'GeM Registered', desc: 'Available on Government e-Marketplace for simplified government procurement.' },
                    { icon: 'fa-registered', title: 'Startup India Recognized', desc: 'Recognized by DPIIT under Startup India for innovation in digital governance solutions.' },
                    { icon: 'fa-infinity', title: 'Built for Scale', desc: 'Handles hundreds of terabytes and millions of concurrent document transactions.' },
                ]}
            />

            <section style={{ padding: '80px 0', background: 'white' }} className="reveal">
                <div className="max-container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '800', marginBottom: '16px' }}>Government Clients We Are Proud To Serve</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '48px', fontSize: '17px' }}>Trusted by the Judiciary, National Institutions & State Governments</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                        {['Indian Patent Office', 'National Archives', 'Odisha High Court', 'Allahabad High Court', 'Madras High Court', 'Rajasthan High Court', 'Kerala High Court', 'Govt of Maharashtra'].map((name, i) => (
                            <div key={i} style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 24px', fontWeight: '700', color: 'var(--text-dark)', fontSize: '14px' }}>{name}</div>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner title="Partner With Us for a Digital Government" subtitle="Join India's leading government institutions in the digital transformation journey with VSDOX." />

        </>
    );
};

/* ═══════════════════════════════════════════════════════════
   JUDICIARY
   ═══════════════════════════════════════════════════════════ */
export const Judiciary = () => {
    useEffect(() => { window.scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(el => el.classList.add('fade-in')); }, []);
    return (
        <>
            <PageHero
                tag="INDUSTRY SOLUTION · JUDICIARY"
                title="Digital Transformation for Courts & Legal Systems"
                subtitle="Streamline e-filing, digitize case records, and enable intelligent information retrieval for high courts, district courts, and legal institutions."
                bgImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2400&auto=format&fit=crop"
            />

            <StatsStrip stats={[
                { value: '15+', label: 'High Courts Digitized' },
                { value: '25M+', label: 'Judicial Records Managed' },
                { value: '75%', label: 'Faster Case File Retrieval' },
                { value: 'Secure', label: 'End-to-End Encryption' }
            ]} />

            <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '100px 0' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }} className="reveal">
                        <span className="info-tag" style={{ background: 'rgba(29,99,237,0.15)', color: '#60a5fa', border: '1px solid rgba(29,99,237,0.2)' }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: '800', color: 'white', margin: '20px 0' }}>E-Court & Legal Document Management</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '700px', margin: '0 auto', fontSize: '17px' }}>Trusted by over 15 High Courts in India to manage the digitisation and retrieval of millions of case files.</p>
                    </div>
                    <FeatureGrid features={[
                        { icon: 'fa-gavel', title: 'Case File Digitization', desc: 'Convert legacy physical case files into structured, searchable digital records with high-fidelity OCR.' },
                        { icon: 'fa-file-signature', title: 'E-Filing Workflows', desc: 'Secure digital submission of petitions, evidence, and legal documents with automated indexing.' },
                        { icon: 'fa-scale-balanced', title: 'Judgment & Order Repository', desc: 'Searchable database of judgments and orders with AI-powered semantic search and citation cross-linking.' },
                        { icon: 'fa-book', title: 'Legal Research & Discovery', desc: 'Advanced search capabilities to find precedents and relevant case law across multiple years and courts.' },
                        { icon: 'fa-user-lock', title: 'Audit Trail & Compliance', desc: 'Complete history of document access and modifications to ensure the integrity of judicial records.' },
                        { icon: 'fa-network-wired', title: 'Integrated Court Ecosystem', desc: 'Connect with ICJS and other judicial data grids for seamless information exchange.' },
                    ]} />
                </div>
            </section>

            <BenefitsList
                title="Modernizing Justice Through Technology"
                desc="VSDOX enables judiciary systems to reduce pendency, improve transparency, and provide faster access to justice through digital transformation."
                benefits={[
                    { icon: 'fa-bolt-lightning', title: 'Instant Record Retrieval', desc: 'Judges and legal staff can find precise case information in seconds, not hours.' },
                    { icon: 'fa-shield-halved', title: 'Tamper-Proof Storage', desc: 'Ensuring the long-term preservation and security of sensitive legal documents.' },
                    { icon: 'fa-users-viewfinder', title: 'Improved Citizen Access', desc: 'Enable citizens to access case status and orders online through secure portals.' },
                    { icon: 'fa-paper-plane', title: 'Paperless Courtrooms', desc: 'Reduce the reliance on physical files and move towards a modern, efficient digital environment.' },
                ]}
            />

            <CTABanner title="Ready to Modernize Your Judicial System?" subtitle="Join the 15+ High Courts already using VSDOX to power their digital transformation." />

        </>
    );
};
