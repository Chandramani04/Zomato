import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Auth.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserRegister = () => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        const response = await axios.post(
            "http://localhost:3000/api/auth/user/register",
            {
                fullName: name,
                email,
                password,
            },
            {
                withCredentials: true,
            },
        );
        console.log(response.data);

        
        // once registered , redirect to home page 
        navigate("/");  
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create an Account</h2>
                <p className="subtitle">Join Zomato and order your favorite food</p>
                <form className="auth-form" onSubmit={(e) => handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="email" id="email" placeholder="name@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="auth-btn">
                        Sign Up
                    </button>
                </form>
                <div className="auth-links">
                    <span>Already have an account?</span>
                    <Link to="/user/login">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;
