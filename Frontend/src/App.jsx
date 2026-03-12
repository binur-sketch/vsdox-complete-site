import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import {
  Products,
  Solutions,
  Industries,
  Resources,
  Contact,
  Legal,
  About
} from './pages/Pages';

import {
  BankingBFSI,
  Healthcare,
  Corporate,
  Education,
  Government,
  Judiciary
} from './pages/IndustryPages';

import {
  CaseStudies,
  ContactUs,
  PrivacyPolicy,
  TermsConditions,
} from './pages/CompanyPages';

import ScrollToTop from './components/ScrollToTop';
import RequestDemo from './pages/RequestDemo';
import DigitizationServices from './pages/DigitizationServices';
import AdminLogin from './pages/AdminLogin';
import BlogPost from './pages/BlogPost';
import Blog from './pages/Blog';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';



function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>

            {/* Home */}
            <Route index element={<Home />} />

            {/* Main Nav Pages */}
            <Route path="products" element={<Products />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="industries" element={<Industries />} />
            <Route path="resources" element={<Resources />} />
            <Route path="about" element={<About />} />

            {/* Industry Solution Pages */}
            <Route path="solutions/banking-bfsi" element={<BankingBFSI />} />
            <Route path="solutions/healthcare" element={<Healthcare />} />
            <Route path="solutions/corporate" element={<Corporate />} />
            <Route path="solutions/education" element={<Education />} />
            <Route path="solutions/government" element={<Government />} />
            <Route path="solutions/judiciary" element={<Judiciary />} />

            {/* Company / Utility Pages */}
            <Route path="contact" element={<ContactUs />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="digitization-services" element={<DigitizationServices />} />

            {/* Industry Specific Routes */}
            <Route path="industries/banking-bfsi" element={<BankingBFSI />} />
            <Route path="industries/healthcare" element={<Healthcare />} />
            <Route path="industries/corporate" element={<Corporate />} />
            <Route path="industries/education" element={<Education />} />
            <Route path="industries/government" element={<Government />} />
            <Route path="industries/judiciary" element={<Judiciary />} />

            {/* Admin */}
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<AdminDashboard />} />

            {/* Legacy */}
            <Route path="legal" element={<PrivacyPolicy />} />

            {/* Request Demo */}
            <Route path="request-demo" element={<RequestDemo />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
