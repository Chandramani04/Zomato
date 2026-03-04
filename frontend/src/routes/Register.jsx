import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Register.css'

const Home = () => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">Zomato</div>
                <div className="nav-links">
                    <Link to="/food-partner/register" className="nav-link">Add Restaurant</Link>
                    <Link to="/user/login" className="nav-link">Log in</Link>
                    <Link to="/user/register" className="nav-link signup-btn">Sign up</Link>
                </div>
            </nav>

            <main className="hero-section">
                <h1 className="hero-title">Zomato</h1>
                <p className="hero-subtitle">Discover the best food & drinks in your city</p>

                <div className="split-cards">
                    {/* User Section */}
                    <div className="action-card">
                        <h3>For Foodies</h3>
                        <p>Order food online, explore the best restaurants, and read user reviews.</p>
                        <Link to="/user/register" className="btn-primary">Create an account</Link>
                        <Link to="/user/login" className="btn-outline">Log in to order</Link>
                    </div>

                    {/* Partner Section */}
                    <div className="action-card">
                        <h3>For Restaurants</h3>
                        <p>Partner with us, manage your listings, and reach more customers online.</p>
                        <Link to="/food-partner/register" className="btn-primary">Register restaurant</Link>
                        <Link to="/food-partner/login" className="btn-outline">Partner login</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
