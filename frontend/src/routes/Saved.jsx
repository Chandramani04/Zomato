import React from 'react';
import VideoFeed from '../components/VideoFeed';

const Saved = () => {
    return <VideoFeed endpoint="http://localhost:3000/api/food/saved" isSavedView={true} />;
};

export default Saved;
