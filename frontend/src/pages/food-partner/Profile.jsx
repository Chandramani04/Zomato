import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Profile.css';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const videoRefs = useRef({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3000/api/food-partner/${id}`, {
                    withCredentials: true
                });

                const { foodPartner } = response.data;
                setProfile(foodPartner);
                setError(null);
            } catch (err) {
                console.error("Error fetching partner profile:", err);
                setError("Failed to load profile data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const formatStat = (num) => {
        if (!num) return "0";
        if (num >= 1000) return (num / 1000).toFixed(1) + "k+";
        return num.toString();
    };

    if (isLoading) {
        return <div className="profile-loading">Loading Profile...</div>;
    }

    if (error || !profile) {
        return (
            <div className="profile-error">
                <h2>Oops!</h2>
                <p>{error || "Partner not found"}</p>
                <button onClick={() => navigate(-1)} className="btn-go-back">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {/* Header Section */}
            <div className="profile-header-card">
                <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>

                <div className="profile-header-content">
                    <div className="profile-avatar">
                        <img
                            src={profile.avatar || "https://placehold.co/150x150/ef4f5f/ffffff?text=Avatar"}
                            alt={`${profile.name || 'Partner'} avatar`}
                        />
                    </div>

                    <div className="profile-details">
                        <h1 className="profile-name">{profile.name || "Restaurant Name"}</h1>
                        <p className="profile-address">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            {profile.address || "Address not provided"}
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="profile-stats-container">
                    <div className="stat-card">
                        <span className="stat-value">{formatStat(profile.totalMeals || 2500)} Meals</span>
                        <span className="stat-label">Total Served</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{formatStat(profile.customerServe || 1200)}</span>
                        <span className="stat-label">Customers</span>
                    </div>
                </div>
            </div>

            {/* Reels Section */}
            <div className="reels-section">
                <h2 className="section-title">Reels</h2>
                <div className="reels-grid">
                    {profile.foodItems && profile.foodItems.length > 0 ? (
                        profile.foodItems.map((item) => (
                            <div key={item._id} className="reel-card">
                                {/* Thumbnail Placeholder */}
                                <div className="reel-thumbnail" style={{ backgroundImage: `url(${item.thumbnail || 'https://placehold.co/300x533/1a1a1a/ffffff?text=Food+Reel'})` }}>
                                    <video
                                        ref={(el) => (videoRefs.current[item._id] = el)}
                                        className="reel-video"
                                        src={item.video}
                                        preload="metadata"
                                        muted
                                        loop
                                        playsInline
                                        onClick={(e) => {
                                            if (e.target.paused) {
                                                // Pause all other videos first
                                                Object.values(videoRefs.current).forEach((video) => {
                                                    if (video && video !== e.target && !video.paused) {
                                                        video.pause();
                                                    }
                                                });

                                                e.target.muted = false; // Unmute sound when played
                                                e.target.play().catch(() => { });
                                            } else {
                                                e.target.pause();
                                            }
                                        }}
                                    />
                                    <div className="reel-overlay" style={{ pointerEvents: 'none' }}>
                                        <div className="play-icon">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="reel-info" style={{ pointerEvents: 'none' }}>
                                        <h3 className="reel-title">{item.name || "Delicious Food"}</h3>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Placeholder Reels Display
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="reel-card">
                                <div className="reel-thumbnail" style={{ backgroundImage: `url(https://placehold.co/300x533/1a1a1a/ffffff?text=Reel+${index + 1})` }}>
                                    <div className="reel-overlay">
                                        <div className="play-icon">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="reel-info">
                                        <h3 className="reel-title">Delicious Food {index + 1}</h3>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;