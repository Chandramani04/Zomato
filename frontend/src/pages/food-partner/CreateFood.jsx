import React, { useState, useEffect } from 'react';
import '../../styles/CreateFood.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';

const CreateFood = () => {
  const navigate = useNavigate();
  const [foodDetails, setFoodDetails] = useState({
    name: '',
    description: '',
    price: '',
    video: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setFoodDetails((prevDetails) => ({
        ...prevDetails,
        video: selectedFile
      }));
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const clearVideo = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFoodDetails((prevDetails) => ({
      ...prevDetails,
      video: null
    }));
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodDetails.video) {
      return;
    }
    const formData = new FormData();
    formData.append('name', foodDetails.name);
    formData.append('description', foodDetails.description);
    formData.append('price', foodDetails.price);
    formData.append('video', foodDetails.video);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/food',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-food-container">
      <div className="create-food-card">
        <div className="create-food-header">
          <h1 className="create-food-title">Upload Video</h1>
          <p className="create-food-subtitle">Share your recipes</p>
        </div>

        <form className="create-food-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Food Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="E.g., Spicy Chicken Tacos"
              value={foodDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Tell us about this dish..."
              value={foodDetails.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="e.g. 299"
              value={foodDetails.price}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-group file-upload-group">
            <label className="file-upload-label-text">Recipe Video</label>

            {!previewUrl ? (
              <label htmlFor="video" className="file-upload-dropzone">
                <div className="file-upload-content">
                  <span className="file-icon">🎥</span>
                  <span className="file-text">Click to select a video</span>
                  <span className="file-hint">MP4 format, up to 100MB</span>
                </div>
              </label>
            ) : (
              <div className="video-preview-container">
                <video
                  src={previewUrl}
                  controls
                  className="video-preview"
                  autoPlay
                  muted
                  loop
                />
                <div className="video-actions">
                  <span className="video-name">{foodDetails.video?.name}</span>
                  <button type="button" className="remove-video-button" onClick={clearVideo}>
                    ✕ Remove
                  </button>
                </div>
              </div>
            )}

            <input
              type="file"
              id="video"
              name="video"
              accept=".mp4"
              onChange={handleFileChange}
              required={!foodDetails.video}
            />
          </div>

          <button type="submit" className="upload-button">
            Upload Food
          </button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
};

export default CreateFood;