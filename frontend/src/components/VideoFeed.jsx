import React, { useState, useEffect } from 'react';
import VideoItem from './VideoItem';
import BottomNav from './BottomNav';
import '../styles/VideoFeed.css';
import axios from 'axios';

const VideoFeed = ({ endpoint = 'http://localhost:3000/api/food/' }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(endpoint, {
                    withCredentials: true // Required to send the auth cookie
                });

                if (response.data && response.data.success) {
                    console.log(response.data);
                    const mappedVideos = response.data.foodItems.map(item => ({
                        id: item._id,
                        url: item.video,
                        description: item.description,
                        storeUrl: `/food-partner/${item.foodPartner}`,
                        name: item.name,
                        likeCount: item.likeCount || 0,
                        isLiked: item.isLiked || false,
                        saveCount: item.saveCount || 0,
                        isSaved: item.isSaved || false
                    }));
                    setVideos(mappedVideos);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to fetch videos');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [endpoint]);

    if (loading) {
        return <div style={{ color: "white", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading amazing videos...</div>;
    }

    if (error) {
        return <div style={{ color: "red", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>Error: {error}</div>;
    }

    if (!videos || videos.length === 0) {
        return <div style={{ color: "white", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>No videos found. Check back later!</div>;
    }

    return (
        <div className="video-feed-container">
            {videos.map((video) => (
                <VideoItem key={video.id} video={video} />
            ))}
            <BottomNav />
        </div>
    );
};

export default VideoFeed;
