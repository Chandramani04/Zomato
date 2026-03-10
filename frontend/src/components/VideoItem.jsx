import React, { useRef, useEffect } from 'react';
import useElementOnScreen from '../hooks/useElementOnScreen';
import { useNavigate } from 'react-router-dom';
import VideoActions from './VideoActions';

const VideoItem = ({ video }) => {
    const navigate = useNavigate();
    const [containerRef, isVisible] = useElementOnScreen({
        threshold: 0.8 // Require 80% visibility before triggering
    });

    const videoRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            videoRef.current?.play().catch(error => {
                // Handling browser autoplay policies cleanly
                console.error('Autoplay prevented by browser:', error);
            });
        } else {
            videoRef.current?.pause();
        }
    }, [isVisible]);

    const handleVisitStore = () => {
        // Navigates the user to the storeUrl without a full page reload!
        navigate(video.storeUrl);
    };

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    };

    return (
        <div className="video-item" ref={containerRef}>
            <video
                ref={videoRef}
                className="video-player"
                onClick={togglePlayPause}
                src={video.url}
                loop
                // muted
                playsInline
                autoPlay
                preload='metadata'
            />

            <div className="video-actions-wrapper">
                <VideoActions 
                  videoId={video.id} 
                  initialLikes={video.likeCount} 
                  initialIsLiked={video.isLiked} 
                  initialSaves={video.saveCount}
                  initialIsSaved={video.isSaved}
                />
            </div>

            <div className="video-overlay">
                <p className="video-description">{video.description}</p>
                <button
                    className="visit-store-btn"
                    onClick={handleVisitStore}
                >
                    Visit Store
                </button>
            </div>
        </div>
    );
};

export default VideoItem;
