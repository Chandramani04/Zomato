import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/BottomNav.css';

// Inline SVGs 
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const SavedIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if current path matches
    const isHome = location.pathname === '/';
    // Let's assume saved page is /saved
    const isSaved = location.pathname === '/saved';

    return (
        <div className="bottom-nav-container">
            <div 
                className={`nav-item ${isHome ? 'active' : ''}`}
                onClick={() => navigate('/')}
            >
                <HomeIcon active={isHome} />
                <span className="nav-text">home</span>
            </div>
            
            <div 
                className={`nav-item ${isSaved ? 'active' : ''}`}
                onClick={() => navigate('/saved')}
            >
                <SavedIcon active={isSaved} />
                <span className="nav-text">saved</span>
            </div>
        </div>
    );
};

export default BottomNav;
