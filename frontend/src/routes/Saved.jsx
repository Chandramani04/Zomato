import React from 'react';
import VideoFeed from '../components/VideoFeed';

const Saved = () => {
    return <VideoFeed endpoint="/api/food/saved" isSavedView={true} />;
};

export default Saved;
