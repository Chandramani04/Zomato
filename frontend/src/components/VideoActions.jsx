import React, { useState } from 'react';
import axios from 'axios';
import '../styles/VideoActions.css';

// Inline SVGs for no dependencies
const HeartIcon = ({ filled }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? "#ef4f5f" : "none"} stroke={filled ? "#ef4f5f" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const CartIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const VideoActions = ({ videoId, initialLikes = 23, initialIsLiked = false, initialSaves = 23, initialIsSaved = false }) => {
    // Local state for UI feedback. Will be replaced by real API calls later
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [savesCount, setSavesCount] = useState(initialSaves);

    const handleLike = async (e) => {
        e.stopPropagation();
        
        // Optimistic UI Update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
        
        try {
            const response = await axios.post(
                '/api/food/like',
                { foodId: videoId },
                { withCredentials: true } // Need this for the auth token
            );
            
            // If the backend fails unexpectedly but returns 200 OK
            if (response.data && !response.data.success) {
                setIsLiked(!newIsLiked);
                setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error("Error updating like status:", error);
            // Revert optimistic update on error
            setIsLiked(!newIsLiked);
            setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        
        // Optimistic UI Update
        const newIsSaved = !isSaved;
        setIsSaved(newIsSaved);
        setSavesCount(prev => newIsSaved ? prev + 1 : prev - 1);
        
        try {
            const response = await axios.post(
                '/api/food/save',
                { foodId: videoId },
                { withCredentials: true } 
            );
            
            // If the backend fails unexpectedly but returns 200 OK
            if (response.data && !response.data.success) {
                setIsSaved(!newIsSaved);
                setSavesCount(prev => !newIsSaved ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error("Error updating save status:", error);
            // Revert optimistic update on error
            setIsSaved(!newIsSaved);
            setSavesCount(prev => !newIsSaved ? prev + 1 : prev - 1);
        }
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        try {
            const response = await axios.post(
                '/api/cart/add',
                { foodId: videoId },
                { withCredentials: true }
            );
            if (response.data && response.data.success) {
                // Could dispatch to a global state store or show toast!
                console.log("Added to cart!");
            }
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    return (
        <div className="video-actions-container">
            <div className="action-button-group" onClick={handleLike}>
                <div className="icon-wrapper">
                    <HeartIcon filled={isLiked} />
                </div>
                <span className="action-text">likes : {likesCount === 0 ? '0' : likesCount}</span>
            </div>

            <div className="action-button-group" onClick={handleSave}>
                <div className="icon-wrapper">
                    <BookmarkIcon filled={isSaved} />
                </div>
                <span className="action-text">Save : {savesCount === 0 ? '0' : savesCount}</span>
            </div>

            <div className="action-button-group" onClick={handleAddToCart}>
                <div className="icon-wrapper">
                    <CartIcon />
                </div>
                <span className="action-text">Add to Cart</span>
            </div>
        </div>
    );
};

export default VideoActions;
