import { motion } from "framer-motion";
import {
    Building2, Rocket, Award, GraduationCap, FileText, Printer,
    Shield, Car, BookOpen, Globe, Medal, Users, BarChart3,
    Briefcase, Star, Search
} from "lucide-react";

const earlyMilestones = [
    { year: "2015", title: "VIR Softech Inception", desc: "Few friends with brilliant careers and complimentary skills join hands to conceive VIR Softech.", color: "#e11d48" },
    { year: "2016", title: "Eval OMR Launch", desc: "Our first product is live. We launch the Eval OMR solution for digital assessment.", color: "#f97316" },
    { year: "2017", title: "Startup Recognition", desc: "Recognized as a start-up company by the Ministry of Commerce & Industry, Govt of India.", color: "#2563eb" },
    { year: "2017", title: "Ministry of Education", desc: "First large-scale deployment. Ministry of Education deploys eVAL OMR in 700 districts.", color: "#475569" },
    { year: "2018", title: "Japanese Print OEM", desc: "A large Japanese Print OEM signs contract for development of their ver 1.0 print software.", color: "#16a34a" },
    { year: "2018", title: "Top 20 DMS", desc: "Recognized as Top 20 Most Promising Document Management System by CIO Review.", color: "#dc2626" },
    { year: "2019", title: "Private Insurance DMS", desc: "Signed contract with one of the largest private life insurance companies in India for DMS.", color: "#2563eb" },
];

const mainMilestones = [
    { year: "2019", desc: "Launched Eval CBT Platform for computer-based testing.", icon: <Rocket className="w-5 h-5" />, color: "#be123c", pos: "bottom" },
    { year: "2020", desc: "Major contract for largest automobile company for DMS implementation.", icon: <Car className="w-5 h-5" />, color: "#1e3a8a", pos: "top" },
    { year: "2020", desc: "Successfully conducted medical college admission exams on eVAL CBT.", icon: <BookOpen className="w-5 h-5" />, color: "#0369a1", pos: "bottom" },
    { year: "2021", desc: "Recognized as Top 10 Most Promising ECM provider by CIO Review.", icon: <Star className="w-5 h-5" />, color: "#111827", pos: "top" },
    { year: "2021", desc: "Developed and released print software products for a US customer.", icon: <Briefcase className="w-5 h-5" />, color: "#0284c7", pos: "bottom" },
    { year: "2023", desc: "Established international sales team and signed customers in Europe.", icon: <Globe className="w-5 h-5" />, color: "#1e293b", pos: "top" },
    { year: "2024", desc: "Defence customer milestone with more than 700 eVAL installations.", icon: <Shield className="w-5 h-5" />, color: "#7f1d1d", pos: "bottom" },
    { year: "2025", desc: "Largest seller of OMR in India. Achieved ISACA / CMMI Level 3 certification.", icon: <Award className="w-5 h-5" />, color: "#ea580c", pos: "top" },
    { year: "2025", desc: "Successful completion of 4M students African school leaving exam projects.", icon: <Users className="w-5 h-5" />, color: "#b45309", pos: "bottom" },
];

const MilestoneTimeline = () => {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container-fluid px-10">
                <div className="historical-journey">

                    {/* Left Column: Early History */}
                    <div className="history-early-list">
                        {earlyMilestones.map((m, i) => (
                            <div key={i} className="early-item">
                                <p className="early-desc"><i>{m.desc}</i></p>
                                <div className="early-year-tag" style={{ borderLeftColor: m.color, color: m.color }}>
                                    {m.year}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Center: Hero Block */}
                    <div className="history-center-block">
                        <div className="blue-ribbon">
                            <h2>Historical Journey of <br />VIR Softech</h2>
                        </div>
                    </div>

                    {/* Right: Main Axis */}
                    <div className="history-main-axis">
                        <div className="horizontal-line" />

                        {mainMilestones.map((m, i) => (
                            <div key={i} className={`milestone-pin-wrapper ${m.pos}`} style={{ left: `${(i * 10) + 5}%` }}>
                                <div className="milestone-year-text" style={{ color: m.color }}>{m.year}</div>
                                <div className="pin-dot" style={{ backgroundColor: m.color }}>
                                    <div className="pin-stem" style={{ backgroundColor: m.color }} />
                                </div>

                                {/* Content Card */}
                                <div className={`milestone-card ${m.pos}`} style={{ borderColor: m.color }}>
                                    <p className="card-desc">{m.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MilestoneTimeline;
