import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClientLogos from '../components/ClientLogos';
import GovtRegistrations from '../components/GovtRegistrations';
import logo from '../logo.png';
import heroVsdox from '../assets/hero-vsdox.png';
import isoCert from '../assets/iso.jpg';
import cmmiCert from '../assets/cmmi.jpg';
import headlessDms from '../assets/headless DMS.png';
import abLogo from '../assets/ABHFL_OG.png';
import religareLogo from '../assets/Religare-Broking-Ltd..jpg';
import hdfcLogo from '../assets/hdfclife.jpg';

const Home = () => {
    useEffect(() => {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, []);

    return (
        <main>
            {/* Redesigned Hero Section V4 */}
            <section className="hero-v4">
                <div className="max-container">
                    <div className="hero-v4-container">
                        <div className="hero-content reveal">
                            <div className="hero-tag">
                                <span className="dot"></span>
                                AI-POWERED DOCUMENT INTELLIGENCE
                            </div>
                            <h1>
                                Reduce <span className="gradient-text">Operational Burden</span> with Intelligent ECM
                            </h1>
                            <p>
                                Transform your documentation workflow with VSDOX AI. Automate classification, extraction, and retrieval while ensuring enterprise-grade security and scalability.
                            </p>
                            <div className="hero-buttons-v4">
                                <Link to="#" className="btn-primary">Learn More About VSDOX</Link>
                                <Link to="/request-demo" className="btn-primary">Platform Demo</Link>
                            </div>
                        </div>

                        <div className="hero-visual-v4 reveal" style={{ transitionDelay: '0.3s' }}>
                            <div className="main-visual-card">
                                <img src={heroVsdox} alt="VSDOX AI Dashboard Interface" style={{ borderRadius: '24px' }} />
                            </div>

                            <div className="floating-element fe-1">
                                <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-bolt-lightning" style={{ fontSize: '18px' }}></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>AI Features</div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>Auto Tagging & Metadata Extraction</div>
                                </div>
                            </div>

                            <div className="floating-element fe-2">
                                <div style={{ background: '#ebf2ff', padding: '10px', borderRadius: '12px', color: '#1d63ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fas fa-shield-halved" style={{ fontSize: '18px' }}></i>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>Secured Vault</div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>AES 256-bit Encryption</div>
                                </div>
                            </div>

                            {/* Decorative background glows */}
                            <div style={{
                                position: 'absolute',
                                width: '400px',
                                height: '400px',
                                background: 'radial-gradient(circle, rgba(29, 99, 237, 0.15) 0%, transparent 70%)',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1
                            }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Capabilities Section */}
            <section className="ai-capabilities-section section-padding reveal">
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontWeight: '800', marginBottom: '20px', color: 'white' }}>AI-Powered Enterprise Content Management</h2>
                        <p style={{ color: '#94a3b8', maxWidth: '800px', margin: '0 auto', fontSize: '18px' }}>
                            Leverage advanced AI capabilities within VSDOX to automate, classify, extract, and retrieve information with precision.
                        </p>
                    </div>

                    <div className="ai-features-grid">
                        <div className="ai-feature-card">
                            <div className="ai-icon"><i className="fas fa-file-contract"></i></div>
                            <h3>RAG-Based Q&A</h3>
                            <p>An on-premise, cloud based Retrieval-Augmented Generation solution that securely answers user queries by retrieving and generating responses directly from your organization’s internal documents and DMS data.</p>
                        </div>
                        <div className="ai-feature-card">
                            <div className="ai-icon"><i className="fas fa-layer-group"></i></div>
                            <h3>Automatic Metadata Extraction</h3>
                            <p>Automatically captures and indexes key information (e.g., case details, patient data, IDs, dates) from ingested documents, enabling accurate classification, faster search, and streamlined document management across domains.</p>
                        </div>
                        <div className="ai-feature-card">
                            <div className="ai-icon"><i className="fas fa-sitemap"></i></div>
                            <h3>Automatic Document Type Association</h3>
                            <p>Intelligently classifies and segments bulk-uploaded or scanned files by identifying document types and page ranges (e.g., index, judgment, petition, ID proofs, salary slips), ensuring structured and organized record management.</p>
                        </div>
                        <div className="ai-feature-card">
                            <div className="ai-icon"><i className="fas fa-microchip"></i></div>
                            <h3>Document Summarization</h3>
                            <p>Automatically condenses lengthy documents (e.g., 50–500 page case files) into concise, easy-to-review summaries, enabling faster understanding and decision-making.</p>
                        </div>
                        <div className="ai-feature-card">
                            <div className="ai-icon"><i className="fas fa-language"></i></div>
                            <h3>AI Translation & Transliteration</h3>
                            <p>Automatically translates uploaded documents into multiple languages and maintains linked parallel versions for multilingual access. It also converts search queries across scripts (e.g., “Amit” ↔ “अमित”) to ensure accurate and seamless document retrieval across languages.</p>
                        </div>
                        <div className="ai-feature-card">
                            <div className="ai-icon"><i className="fas fa-chart-line"></i></div>
                            <h3>Multilingual Speech-to-Text</h3>
                            <p>Converts spoken input in the selected language (e.g., Hindi) into accurate text, enabling hands-free note creation and voice-powered search across the system.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Flexible Hosting Infrastructure */}
            <section className="hosting-section section-padding reveal" style={{ background: 'var(--section-alt)' }}>
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontWeight: '800', marginBottom: '20px' }}>Flexible Hosting Infrastructure</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '900px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6' }}>
                            VSDOX is designed for deployment flexibility, enabling organizations to choose the infrastructure model that aligns with their operational, compliance, and scalability requirements. Built on a high-availability, containerized, and modular architecture, VSDOX ensures performance, resilience, and seamless scalability across environments.
                        </p>
                    </div>

                    <div className="hosting-grid">
                        <div className="hosting-card">
                            <div className="hosting-icon"><i className="fas fa-server"></i></div>
                            <h3>On-Premise Deployment</h3>
                            <p>VSDOX is fully capable of being hosted on your on-premise servers, providing complete control over data, infrastructure, security, and regulatory compliance.</p>
                        </div>
                        <div className="hosting-card">
                            <div className="hosting-icon"><i className="fas fa-cloud"></i></div>
                            <h3>Cloud Deployment</h3>
                            <p>Host VSDOX on public or private cloud platforms—including MeitY-empanelled providers such as National Informatics Centre (NIC Cloud) and STPI—as well as leading hyperscalers like AWS and GCP.</p>
                        </div>
                        <div className="hosting-card">
                            <div className="hosting-icon"><i className="fas fa-network-wired"></i></div>
                            <h3>Hybrid Deployment</h3>
                            <p>Deploy VSDOX in a hybrid architecture that seamlessly integrates on-premise infrastructure with cloud environments, delivering optimal performance and compliance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise-Grade Security */}
            <section className="security-section-enhanced section-padding reveal">
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontWeight: '800', marginBottom: '20px' }}>Enterprise-Grade Security</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '900px', margin: '0 auto', fontSize: '18px' }}>
                            VSDOX implements multi-layered security controls across application, network, and data layers to ensure confidentiality, integrity, availability, and regulatory compliance.
                        </p>
                    </div>

                    <div className="security-features-grid">
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-key"></i></div>
                            <div className="security-item-content">
                                <h4>Multi-Factor Authentication (MFA)</h4>
                                <p>Implements layered authentication mechanisms—including CAPTCHA, OTP-based verification, and email (SMTP) validation—to strengthen access control and prevent unauthorized system entry.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-users-gear"></i></div>
                            <div className="security-item-content">
                                <h4>Role-Based Access Control (RBAC)</h4>
                                <p>Enforces granular access management based on roles and organizational hierarchy—controlling permissions at department, section, and content levels, including upload, view, edit, and delete rights.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-lock"></i></div>
                            <div className="security-item-content">
                                <h4>AES-256 & Encryption at Rest</h4>
                                <p>Secures all stored data using AES-256 encryption, ensuring that even if storage assets are accessed directly, the data remains unreadable without authorized VSDOX access and decryption controls.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-shield-alt"></i></div>
                            <div className="security-item-content">
                                <h4>End-to-End TLS/SSL Encryption</h4>
                                <p>VSDOX secures all data in transit using HTTPS with TLS/SSL encryption, ensuring protected communication between users, applications, and servers.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-id-badge"></i></div>
                            <div className="security-item-content">
                                <h4>Digitally Signed JWT Tokens</h4>
                                <p>Implements secure session management through cryptographically signed JWT tokens, with validation on every API request to protect user identity details and prevent unauthorized access.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-directory-arrow-right"></i></div>
                            <div className="security-item-content">
                                <h4>LDAP & Active Directory Integration (SSO)</h4>
                                <p>Enables secure and seamless authentication through integration with the client’s LDAP or Active Directory, ensuring centralized identity management and controlled user access.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-clipboard-list"></i></div>
                            <div className="security-item-content">
                                <h4>Audit Trails</h4>
                                <p>Maintains comprehensive logs of all user and system activities—including read, write, edit, modify, delete, document view, and batch uploads—ensuring full traceability, accountability, and compliance.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-hourglass-half"></i></div>
                            <div className="security-item-content">
                                <h4>Time-Bound Access Control</h4>
                                <p>Allows administrators to define controlled access durations, enabling authorized users to view or perform actions on documents only within a specified time period, after which access is automatically revoked.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-database"></i></div>
                            <div className="security-item-content">
                                <h4>Backup Scheduler & Disaster Recovery (DR)</h4>
                                <p>Enables automated, time-based backups where administrators can configure specific schedules or intervals, ensuring VSDOX periodically secures both the database and asset store with structured recovery mechanisms for uninterrupted business continuity.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-code"></i></div>
                            <div className="security-item-content">
                                <h4>OWASP Compliance</h4>
                                <p>Developed using secure coding practices aligned with OWASP Top 10 guidelines to proactively mitigate common web application security risks and vulnerabilities.</p>
                            </div>
                        </div>
                        <div className="security-item">
                            <div className="security-item-icon"><i className="fas fa-user-check"></i></div>
                            <div className="security-item-content">
                                <h4>VAPT & STQC Validation</h4>
                                <p>VSDOX undergoes comprehensive Vulnerability Assessment & Penetration Testing (VAPT) and STQC evaluation by MeitY-empanelled security auditing agencies, with all identified vulnerabilities systematically mitigated to ensure compliance and secure deployment readiness.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* End-to-End Digital Content Transformation Section */}
            <section className="content-lifecycle-section section-padding reveal">
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontWeight: '800', marginBottom: '20px' }}>End-to-End Digital Content Transformation</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '1000px', margin: '0 auto', fontSize: '18px', lineHeight: '1.6' }}>
                            From physical file digitization to secure digital storage, VSDOX manages the complete content journey—capturing, structuring, routing through intelligent workflows, and enabling secure search and retrieval within a controlled environment.
                        </p>
                    </div>

                    {/* Capture Section */}
                    <div className="lifecycle-block capture-block reveal">
                        <div className="lifecycle-header">
                            <div className="info-tag">Digital Ingestion</div>
                            <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '15px 0' }}>Capture Solution</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '24px' }}>
                                A Capture Solution is specialized software designed to manage and monitor the complete workflow of document digitization—from physical file receipt to secure repository upload—ensuring traceability, accountability, and quality control at every stage.
                            </p>
                        </div>
                        <div className="capture-workflow-grid">
                            {[
                                { title: "Inventory In & Batch Creation", desc: "Logging physical files and organizing them into trackable batches" },
                                { title: "Batch Preparation & Barcoding", desc: "Sorting, tagging, and preparing files for systematic scanning" },
                                { title: "High-Resolution Scanning", desc: "Converting physical documents into digital images" },
                                { title: "Automated Image Processing", desc: "Auto punch-hole removal, despeckle, deskew, and intelligent enhancement" },
                                { title: "Advanced Image Cleaning", desc: "Noise removal, dark spot correction, brightness adjustment, and quality optimization" },
                                { title: "Multilingual OCR", desc: "Accurate text recognition across multiple languages to make documents searchable" },
                                { title: "Metadata Indexing", desc: "Manual or AI-powered extraction of case numbers, names, IDs, and dates" },
                                { title: "Page-Level Classification", desc: "Intelligent segregation and structuring of document sections" },
                                { title: "Multi-Level Quality Checks", desc: "Scanning QC, Indexing QC, and Client QC for absolute accuracy" },
                                { title: "Export & Secure Upload", desc: "Verified records exported as compliant PDFs (PDF/A) or ZIP with Dublin Core metadata." },
                                { title: "Inventory Out Tracking", desc: "Recording physical file movement after digitization" }
                            ].map((step, idx) => (
                                <div key={idx} className="capture-step">
                                    <span className="step-num">{idx + 1}</span>
                                    <div>
                                        <h5>{step.title}</h5>
                                        <p>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ marginTop: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px', fontSize: '14px', fontStyle: 'italic', borderLeft: '4px solid var(--primary)' }}>
                            The Capture Solution enforces process transparency, ensures data integrity, and provides real-time visibility into digitization progress and productivity metrics.
                        </p>
                    </div>

                    {/* ECM Section */}
                    <div className="lifecycle-block ecm-block reveal" style={{ marginTop: '100px' }}>
                        <div className="lifecycle-header">
                            <div className="info-tag">Strategic Content Management</div>
                            <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '15px 0' }}>VSDOX Enterprise Content Management System</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '32px' }}>
                                VSDOX delivers instant, secure, and intelligent access to enterprise, judicial, and institutional content through a robust platform built on a modern open-source technology stack.
                            </p>
                        </div>
                        <div className="ecm-features-grid-v2">
                            {[
                                { title: "Built on Open-Source", desc: "Ensuring cost efficiency, flexibility, high performance, and freedom from vendor lock-in." },
                                { title: "Multi-Factor Authentication", desc: "Layered verification (CAPTCHA, OTP, SMTP) to prevent unauthorized entry." },
                                { title: "LDAP / AD Integration", desc: "Secure authentication through existing identity management systems." },
                                { title: "Hierarchical Access", desc: "Structured repository with granular department and document-level controls." },
                                { title: "Role-Based Access (RBAC)", desc: "Granular permissions for upload, view, edit, and delete rights." },
                                { title: "Smart Categorization", desc: "Automatically organizes documents by type, status, or domain." },
                                { title: "Workflow Steering", desc: "Configurable review and verification with role-based approval controls." },
                                { title: "Advanced Faceted Search", desc: "Refined discovery using structured filters and dynamic facets." },
                                { title: "Intelligent Search", desc: "Phonetic, fuzzy, thesaurus-based, and nested-faceted document discovery." },
                                { title: "Multilingual UI", desc: "Seamless experience in the user's selected language scripts." },
                                { title: "RAG-Based Q&A", desc: "Internal Retrieval-Augmented Generation for contextual document queries." },
                                { title: "Adaptive Video Streaming", desc: "Acts as a smart middleman between the server and users—delivering video in real-time chunks with Adaptive Bitrate (ABR) technology. Eliminates buffering on slow connections, enables instant timeline seeking, and ensures flawless playback on every device." }
                            ].map((feat, idx) => (
                                <div key={idx} className="ecm-feature-v2">
                                    <div className="feat-icon"><i className="fas fa-check-circle"></i></div>
                                    <div>
                                        <h5>{feat.title}</h5>
                                        <p>{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Workflow Section */}
                    <div className="lifecycle-block workflow-master-block reveal" style={{ marginTop: '100px' }}>
                        <div className="lifecycle-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                            <div className="info-tag">Process Automation</div>
                            <h3 style={{ fontSize: '32px', fontWeight: '800', margin: '15px 0' }}>Workflow Management</h3>
                            <p style={{ fontSize: '16px', color: 'var(--text-main)', maxWidth: '900px', margin: '0 auto' }}>
                                VSDOX enables organizations to digitize physical document movement—transforming manual file circulation into secure, trackable, and auditable digital workflows tailored to organizational hierarchies.
                            </p>
                        </div>

                        {/* Workflow Types Grid */}
                        <div className="workflow-variants-grid">
                            {/* Static Workflow */}
                            <div className="workflow-variant-card">
                                <h4>Static Multi-Level Approval</h4>
                                <p className="variant-intro">A configurable, sequential approval chain (1, 2, or 3 levels) designed for structured verification and accountability.</p>
                                <ul className="variant-details">
                                    <li><strong>Structure:</strong> Sequential approval tailored to organizational hierarchy.</li>
                                    <li><strong>Review:</strong> Reviewers validate content & metadata with mandatory comments.</li>
                                    <li><strong>Correction:</strong> Rejected docs are corrected and resubmitted.</li>
                                    <li><strong>Audit:</strong> Full action logging for compliance and traceability.</li>
                                </ul>
                                <div className="variant-footer">Structured, transparent, and flexible document integrity.</div>
                            </div>

                            {/* Dynamic Workflow */}
                            <div className="workflow-variant-card">
                                <h4>Dynamic / Ad-Hoc Workflow</h4>
                                <p className="variant-intro">Highly flexible model enabling real-time routing and hierarchy modification for exceptional or complex cases.</p>
                                <ul className="variant-details">
                                    <li><strong>Flexibility:</strong> Real-time routing with on-the-fly reviewer assignment.</li>
                                    <li><strong>Review:</strong> Authorized officers can assign/reassign reviewers at any stage.</li>
                                    <li><strong>Multi-cycle:</strong> Documents can be resubmitted multiple times for verification.</li>
                                    <li><strong>Logging:</strong> Every dynamic routing action is captured for full auditability.</li>
                                </ul>
                                <div className="variant-footer">Supports exceptional-case escalation and real-time collaboration.</div>
                            </div>

                            {/* Hierarchical/Sensitive Workflow */}
                            <div className="workflow-variant-card highlight">
                                <h4>Hierarchical Verification & Correction</h4>
                                <p className="variant-intro">Multi-tier, audit-driven path for sensitive records (e.g., land docs) with dedicated reviewer and modifier levels.</p>
                                <ul className="variant-details">
                                    <li><strong>Hierarchy:</strong> Follows path (e.g., SR → DSR → IGR) with specific modifiers.</li>
                                    <li><strong>Validation:</strong> Checks property details, party names, and critical fields.</li>
                                    <li><strong>Modification:</strong> Rejected docs go to modifiers for data creation/correction.</li>
                                    <li><strong>Traceability:</strong> Maintaining operational accuracy for critical information.</li>
                                </ul>
                                <div className="variant-footer">Precise multi-level correction for high-compliance records.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Headless DMS Section */}
            <section className="headless-dms-section section-padding reveal" style={{ background: '#f8fafc' }}>
                <div className="max-container">
                    <div className="headless-container">
                        <div className="headless-content">
                            <div className="info-tag">REST API–Based Architecture</div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '15px 0' }}>Headless DMS (REST API–Based Architecture)</h2>
                            <p style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '24px' }}>
                                A Headless DMS is a REST API–driven document management solution where all document storage, metadata, security, and workflows are managed in the backend through an Admin Panel.
                            </p>
                            <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                                Documents are stored and controlled centrally in the DMS, while customers use their own custom front-end (web portal, mobile app, ERP, etc.) to fetch and display document data via secure APIs. This approach provides full UI flexibility while keeping document governance, access control, and compliance centralized in the backend system.
                            </p>

                            <div className="headless-comparison">
                                <div className="comp-item">
                                    <strong>Traditional DMS</strong>
                                    <span>Backend + Fixed UI</span>
                                </div>
                                <div className="comp-arrow"><i className="fas fa-arrow-right-long"></i></div>
                                <div className="comp-item highlight">
                                    <strong>Headless DMS</strong>
                                    <span>Backend Only (Build Your Own UI)</span>
                                </div>
                            </div>

                            <div className="headless-benefits-grid">
                                <div className="benefit-pill"><i className="fas fa-palette"></i> Full Front-end Customization</div>
                                <div className="benefit-pill"><i className="fas fa-plug-circle-bolt"></i> Easy Integration</div>
                            </div>

                            <div className="headless-proof">
                                <p>Delivered Headless DMS solution to industry leaders:</p>
                                <div className="proof-logos-inline">
                                    <img src={abLogo} alt="Aditya Birla Group" className="headless-customer-logo" />
                                    <img src={religareLogo} alt="Religare" className="headless-customer-logo" />
                                    <img src={hdfcLogo} alt="HDFC" className="headless-customer-logo" />
                                </div>
                            </div>
                        </div>

                        <div className="headless-visual reveal" style={{ transitionDelay: '0.2s' }}>
                            <div className="headless-image-wrapper">
                                <img src={headlessDms} alt="VSDOX Headless DMS Architecture" />
                                <div className="image-overlay-glow"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>





            {/* Redesigned Trusted Recognition Section - Full Width */}
            <section className="trust-section-premium reveal">
                <div className="max-container">
                    <div className="trust-header-premium">
                        <div className="trust-title-area">
                            <div className="info-tag">Industry Validation</div>
                            <h2 style={{ fontSize: '40px', fontWeight: '800', margin: '20px 0' }}>Trusted Recognition</h2>
                            <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px' }}>
                                VSDOX is recognized for its commitment to quality and operational excellence through international certifications and maturity standards.
                            </p>
                            <div className="industry-pills">
                                <span className="pill-item">ISO 9001:2015</span>
                                <span className="pill-item">CMMI Level 3</span>
                            </div>
                        </div>
                        <div className="trust-badges-area">
                            <div className="recognition-badge">
                                <img src={isoCert} alt="ISO 9001:2015 Certification" />
                                <h4>Certified</h4>
                                <p>ISO 9001:2015</p>
                            </div>
                            <div className="recognition-badge">
                                <img src={cmmiCert} alt="CMMI Level 3 Maturity" />
                                <h4>Maturity</h4>
                                <p>CMMI Level 3 from CMMI Institute</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="trust-full-width-strip">
                    <div className="max-container">
                        <div className="trust-stats-grid">
                            <div className="stat-item-premium">
                                <span className="stat-number">200M+</span>
                                <span className="stat-label">Documents Processed</span>
                            </div>
                            <div className="stat-item-premium">
                                <span className="stat-number">500+</span>
                                <span className="stat-label">Enterprise Clients</span>
                            </div>
                            <div className="stat-item-premium">
                                <span className="stat-number">99.9%</span>
                                <span className="stat-label">Platform Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-container" style={{ textAlign: 'center', marginTop: '40px' }}>
                    <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                        Trusted by leaders across Government, Banking, Judiciary, Education, and Healthcare sectors worldwide.
                    </p>
                </div>
            </section>

            {/* ECM Solutions for Verticals Section */}
            <section className="verticals-section section-padding reveal">
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontWeight: '800' }}>ECM Solutions for Verticals</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Tailored implementations for high-compliance sectors</p>
                    </div>

                    <div className="verticals-grid">
                        <div className="vertical-card">
                            <div className="vertical-icon"><i className="fas fa-university"></i></div>
                            <h3>BFSI</h3>
                            <ul className="vertical-list">
                                <li><strong>Banking:</strong> Account opening forms, Account holder details & forms, Retail & Commercial lending</li>
                                <li><strong>Insurance:</strong> New policies, Policy Servicing, Service request management</li>
                            </ul>
                        </div>
                        <div className="vertical-card">
                            <div className="vertical-icon"><i className="fas fa-landmark"></i></div>
                            <h3>Government</h3>
                            <ul className="vertical-list">
                                <li><strong>Ministries:</strong> Automation Repositories, Grants management</li>
                                <li><strong>Public Services:</strong> Citizen record digitization & portal integration</li>
                            </ul>
                        </div>
                        <div className="vertical-card">
                            <div className="vertical-icon"><i className="fas fa-gavel"></i></div>
                            <h3>Judiciary</h3>
                            <ul className="vertical-list">
                                <li><strong>Case Records:</strong> Digital case files, evidence management, & judgment archives</li>
                                <li><strong>E-Courts:</strong> Integration with court management systems for faster retrieval</li>
                            </ul>
                        </div>
                        <div className="vertical-card">
                            <div className="vertical-icon"><i className="fas fa-building"></i></div>
                            <h3>Corporate</h3>
                            <ul className="vertical-list">
                                <li><strong>Human Resource:</strong> Employee docs & employment policies</li>
                                <li><strong>Secretarial:</strong> Shareholder, Investor relation documents</li>
                                <li><strong>Regular functions:</strong> R&D, Finance, Customer Experience content</li>
                            </ul>
                        </div>
                        <div className="vertical-card">
                            <div className="vertical-icon"><i className="fas fa-hospital"></i></div>
                            <h3>Healthcare</h3>
                            <ul className="vertical-list">
                                <li><strong>Hospitals & Clinics:</strong> Patient Records digitization, easy access for appointments</li>
                                <li><strong>Insurance:</strong> Patient case history and claims management</li>
                            </ul>
                        </div>
                        <div className="vertical-card">
                            <div className="vertical-icon"><i className="fas fa-graduation-cap"></i></div>
                            <h3>Education</h3>
                            <ul className="vertical-list">
                                <li><strong>Libraries:</strong> Research, Journals, Archives, Subject Text Repositories</li>
                                <li><strong>Institutions:</strong> Managing access to Repositories</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginTop: '60px', textAlign: 'center' }}>
                        <p style={{ fontSize: '18px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-main)' }}>
                            Regardless of which industry you are part of, and what is the scale of your operations, whether you have millions of documentations to store and archive or are a start up with expansive dreams, contact us for transforming your documentation management systems.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Vir Softech Section */}
            <section className="why-vir-softech-section section-padding reveal">
                <div className="max-container">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontWeight: '800' }}>Why Vir Softech</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Vir Softech is a Registered Service Provider of DSpace, ensuring certified expertise, reliable customization, and professional support for enterprise-grade DMS solutions.</p>
                    </div>
                    <div className="why-vir-grid">
                        <div className="why-vir-card">
                            <div className="why-icon"><i className="fas fa-unlock-keyhole"></i></div>
                            <h4>No proprietary licensing</h4>
                            <p>Save seat-based, recurring costs of popular ECM vendors with opensource ECM.</p>
                        </div>
                        <div className="why-vir-card">
                            <div className="why-icon"><i className="fas fa-wand-sparkles"></i></div>
                            <h4>Worry-free magic</h4>
                            <p>Technology is independent of the workflow. You concentrate on your workflow and the ECM-magic is all transparent to you.</p>
                        </div>
                        <div className="why-vir-card">
                            <div className="why-icon"><i className="fas fa-hand-holding-dollar"></i></div>
                            <h4>Reduced cost of ownership</h4>
                            <p>Significant savings in your return on investments. You save at all three phases of project: implementation, run-time, and future-scalability.</p>
                        </div>
                        <div className="why-vir-card">
                            <div className="why-icon"><i className="fas fa-industry"></i></div>
                            <h4>Industry-specific solutions</h4>
                            <p>Vertical solutions for Banking & BFSI, Healthcare, Corporate, Education, Government, and Judiciary.</p>
                        </div>
                        <div className="why-vir-card">
                            <div className="why-icon"><i className="fas fa-ranking-star"></i></div>
                            <h4>Track record of success</h4>
                            <p>Large scale and mid-scale implementation across the globe.</p>
                        </div>
                        <div className="why-vir-card">
                            <div className="why-icon"><i className="fas fa-leaf"></i></div>
                            <h4>Greener and cleaner world</h4>
                            <p>Leave the world greener and cleaner by reducing paper-based footprint and yet not losing any data, efficiency, and be scale-ready.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Government Registrations Section */}
            <GovtRegistrations />

            {/* Our Clientele Section */}
            <ClientLogos />


            {/* CTA Section */}
            <section className="cta-section reveal">
                <div className="max-container" style={{ textAlign: 'center' }}>
                    <h2>Transform the way of Document Management</h2>
                    <p>Regardless of your industry or scale, contact us for transforming your documentation management systems.</p>
                    <Link to="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', marginTop: '30px' }}>Contact Us Now</Link>
                </div>
            </section>
        </main>
    );
};

export default Home;
