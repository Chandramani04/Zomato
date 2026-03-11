import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const FoodPartnerRegister = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // const {name, email, password,contactName,phone,address} = req.body;
        const name = e.target.restaurantName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const contactName = e.target.contactName.value;
        const phone = e.target.phone.value;
        const address = e.target.address.value;
        const response = await axios.post('http://localhost:3000/api/auth/foodpartner/register', {
            name,
            email,
            password,
            contactName,
            phone,
            address
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
                <h2>Register Restaurant</h2>
                <p className="subtitle">Partner with us and grow your business</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="restaurantName">Restaurant Name</label>
                        <input type="text" id="restaurantName" placeholder="My Awesome Food Place" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contactName">Contact Name</label>
                        <input type="text" id="contactName" placeholder="Jane Doe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" placeholder="+1 234 567 8900" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea id="address" placeholder="123 Food Street, City, ZIP" rows="2"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" id="email" placeholder="restaurant@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="auth-btn">Register Restaurant</button>
                </form>
                <div className="auth-links">
                    <span>Already a partner?</span>
                    <Link to="/food-partner/login">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default FoodPartnerRegister;
