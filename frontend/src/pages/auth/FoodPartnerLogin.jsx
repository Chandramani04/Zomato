import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FoodPartnerLogin = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const response = await axios.post('http://localhost:3000/api/auth/foodpartner/login', {
            email,
            password
        }, {
            withCredentials: true
        });
        console.log(response.data);
        if (response.data && response.data._id) {
            navigate(`/food-partner/${response.data._id}`);
        }
    }
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div style={{ textAlign: 'center' }}>
                    <span className="partner-badge">Food Partner</span>
                </div>
                <h2>Partner Login</h2>
                <p className="subtitle">Manage your restaurant with Zomato</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" id="email" placeholder="restaurant@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="auth-btn">Log In</button>
                </form>
                <div className="auth-links">
                    <span>Want to partner with us?</span>
                    <Link to="/food-partner/register">Register your restaurant</Link>
                </div>
            </div>
        </div>
    );
};

export default FoodPartnerLogin;
