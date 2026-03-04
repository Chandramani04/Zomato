import React, { useState, useEffect } from 'react';
import VideoItem from './VideoItem';
import '../styles/VideoFeed.css';
import axios from 'axios';

const VideoFeed = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/food/', {
                    withCredentials: true // Required to send the auth cookie
                });

                if (response.data && response.data.success) {
                    const mappedVideos = response.data.foodItems.map(item => ({
                        id: item._id,
                        url: item.video,
                        description: item.description,
                        storeUrl: `/food-partner/${item.foodPartner}`,
                        name: item.name
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
    }, []);

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
        </div>
    );
};

export default VideoFeed;
