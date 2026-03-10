import React, { useState } from 'react';
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

const MessageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
  </svg>
);

const VideoActions = ({ videoId, initialLikes = 23, initialSaves = 23, initialComments = 45 }) => {
    // Local state for UI feedback. Will be replaced by real API calls later
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes);
    const [savesCount, setSavesCount] = useState(initialSaves);

    const handleLike = (e) => {
        e.stopPropagation();
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        // API call to like video would go here
        
    };

    const handleSave = (e) => {
        e.stopPropagation();
        setIsSaved(!isSaved);
        setSavesCount(prev => isSaved ? prev - 1 : prev + 1);
        // API call to save video would go here
    };

    const handleComment = (e) => {
        e.stopPropagation();
        // Open comments modal logic
        console.log("Open comments for", videoId);
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

            <div className="action-button-group" onClick={handleComment}>
                <div className="icon-wrapper">
                    <MessageIcon />
                </div>
                <span className="action-text">Comment:{initialComments}</span>
            </div>
        </div>
    );
};

export default VideoActions;
