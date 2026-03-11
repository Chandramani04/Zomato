import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
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

const CartIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const UploadIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const LogoutIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { authData: { role }, logout } = useAuth();

    // Check if current path matches
    const isHome = location.pathname === '/';
    const isSaved = location.pathname === '/saved';
    const isCart = location.pathname === '/checkout';
    const isUpload = location.pathname === '/create-food';

    const handleLogout = async () => {
        await logout();
        if (role === 'partner') {
            navigate('/food-partner/login');
        } else {
            navigate('/user/login');
        }
    };

    return (
        <div className="bottom-nav-container">
            <div 
                className={`nav-item ${isHome ? 'active' : ''}`}
                onClick={() => navigate('/')}
            >
                <HomeIcon active={isHome} />
                <span className="nav-text">home</span>
            </div>
            
            {role === 'partner' ? (
                <>
                    <div 
                        className={`nav-item ${isUpload ? 'active' : ''}`}
                        onClick={() => navigate('/create-food')}
                    >
                        <UploadIcon active={isUpload} />
                        <span className="nav-text">upload</span>
                    </div>
                    
                    <div 
                        className="nav-item"
                        onClick={handleLogout}
                    >
                        <LogoutIcon active={false} />
                        <span className="nav-text">logout</span>
                    </div>
                </>
            ) : (
                <>
                    <div 
                        className={`nav-item ${isSaved ? 'active' : ''}`}
                        onClick={() => navigate('/saved')}
                    >
                        <SavedIcon active={isSaved} />
                        <span className="nav-text">saved</span>
                    </div>
                    
                    <div 
                        className={`nav-item ${isCart ? 'active' : ''}`}
                        onClick={() => navigate('/checkout')}
                    >
                        <CartIcon active={isCart} />
                        <span className="nav-text">cart</span>
                    </div>

                    <div 
                        className="nav-item"
                        onClick={handleLogout}
                    >
                        <LogoutIcon active={false} />
                        <span className="nav-text">logout</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default BottomNav;
