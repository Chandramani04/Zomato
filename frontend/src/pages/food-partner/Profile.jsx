import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Profile.css';
import BottomNav from '../../components/BottomNav';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const videoRefs = useRef({});

    const [loggedInRole, setLoggedInRole] = useState(null);
    const [loggedInPartnerId, setLoggedInPartnerId] = useState(null);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const res = await axios.get('/api/auth/me', { withCredentials: true });
                setLoggedInRole(res.data.role);
                setLoggedInPartnerId(res.data.id);
            } catch {
                // User is not authenticated or not a partner, do nothing
            }
        };
        fetchAuthStatus();
    }, []);

    const isOwnProfile = loggedInRole === "partner" && id === loggedInPartnerId;

    const handleReelClick = (item) => {
        // Pause background grid videos
        Object.values(videoRefs.current).forEach((video) => {
            if (video && !video.paused) {
                video.pause();
            }
        });
        setSelectedFood(item);
    };

    const closeModal = () => {
        setSelectedFood(null);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await axios.put('/api/food-partner/avatar', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                setProfile(prev => ({ ...prev, avatar: response.data.avatar }));
            }
        } catch (error) {
            console.error("Failed to upload avatar", error);
            alert("Failed to upload avatar");
        }
    };

    const handleDeleteReel = async (foodId) => {
        if (!window.confirm("Are you sure you want to delete this reel?")) return;
        try {
            const response = await axios.delete(`/api/food/${foodId}`, {
                withCredentials: true
            });
            if (response.data.success) {
                setProfile(prev => ({
                    ...prev,
                    foodItems: prev.foodItems.filter(item => item._id !== foodId),
                    totalMeals: Math.max(0, (prev.totalMeals || 0) - 1)
                }));
            }
        } catch (error) {
            console.error("Failed to delete reel", error);
            alert("Failed to delete reel");
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/api/food-partner/${id}`, {
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
                        {isOwnProfile && (
                            <div className="avatar-edit-overlay" onClick={() => document.getElementById('avatar-upload').click()}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                </svg>
                            </div>
                        )}
                        <input type="file" id="avatar-upload" style={{display: 'none'}} accept="image/*" onChange={handleAvatarChange} />
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
                                <div className="reel-thumbnail" style={{ backgroundImage: `url(${item.thumbnail || 'https://placehold.co/300x533/1a1a1a/ffffff?text=Food+Reel'})` }}>
                                    {isOwnProfile && (
                                        <button 
                                            className="reel-delete-btn" 
                                            onClick={(e) => { e.stopPropagation(); handleDeleteReel(item._id); }}
                                            aria-label="Delete video"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18"></path>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    )}
                                    <video
                                        ref={(el) => (videoRefs.current[item._id] = el)}
                                        className="reel-video"
                                        src={item.video}
                                        preload="metadata"
                                        muted
                                        loop
                                        playsInline
                                        onClick={() => handleReelClick(item)}
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
                        <div className="empty-reels-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                            {isOwnProfile ? (
                                <>
                                    <p>You haven't uploaded any reels yet.</p>
                                    <button 
                                        onClick={() => navigate('/create-food')}
                                        style={{ marginTop: '10px', padding: '8px 16px', background: '#ef4f5f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Upload your first reel
                                    </button>
                                </>
                            ) : (
                                <p>No reels have been uploaded yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Food Details Modal */}
            {selectedFood && (
                <div className="food-details-modal-overlay" onClick={closeModal}>
                    <div className="food-details-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">✕</button>
                        <div className="modal-video-container">
                            <video 
                                src={selectedFood.video} 
                                autoPlay 
                                controls 
                                playsInline 
                            />
                        </div>
                        <div className="modal-info-container">
                            <h2 className="modal-food-name">{selectedFood.name || "Delicious Food"}</h2>
                            <p className="modal-price">₹{selectedFood.price || 0}</p>
                            <p className="modal-description">
                                {selectedFood.description || "No description provided."}
                            </p>
                            {loggedInRole === 'user' && (
                                <button 
                                    className="btn-add-to-cart" 
                                    style={{
                                        width: '100%',
                                        marginTop: '15px',
                                        padding: '12px',
                                        backgroundColor: '#ef4f5f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                    onClick={async () => {
                                        try {
                                            const res = await axios.post('/api/cart/add', {
                                                foodId: selectedFood._id
                                            }, { withCredentials: true });
                                            if (res.data.success) {
                                                alert("Added to cart!");
                                            }
                                        } catch (err) {
                                            console.error("Cart error:", err);
                                            alert("Failed to add to cart");
                                        }
                                    }}
                                >
                                    Add to Cart
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
};

export default Profile;