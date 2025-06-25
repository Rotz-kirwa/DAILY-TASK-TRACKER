import React, { useState, useEffect } from 'react';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const savedVideos = JSON.parse(localStorage.getItem('savedVideos')) || [];
    setVideos(savedVideos);
  }, []);

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedVideo(file);
        if (!title) {
          setTitle(file.name.split('.')[0]);
        }
      } else {
        alert('Please select a video file');
      }
    }
  };

  const handleSave = () => {
    if (selectedVideo && title) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newVideo = {
          id: Date.now(),
          title,
          src: event.target.result,
          originalName: selectedVideo.name,
          size: selectedVideo.size,
          type: selectedVideo.type,
          date: new Date().toLocaleString()
        };
        
        const updatedVideos = [...videos, newVideo];
        setVideos(updatedVideos);
        localStorage.setItem('savedVideos', JSON.stringify(updatedVideos));
        
        setTitle('');
        setSelectedVideo(null);
        document.getElementById('video-input').value = '';
      };
      
      reader.readAsDataURL(selectedVideo);
    }
  };

  const handleDelete = (id) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    setVideos(updatedVideos);
    localStorage.setItem('savedVideos', JSON.stringify(updatedVideos));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="page-container">
      <h2>Video Gallery</h2>
      
      <div>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          id="video-input"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />
        {selectedVideo && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Selected video: {selectedVideo.name} ({formatFileSize(selectedVideo.size)})</p>
          </div>
        )}
        <button 
          onClick={handleSave}
          disabled={!selectedVideo || !title}
        >
          Save Video
        </button>
      </div>
      
      <div className="video-grid">
        {videos.length === 0 ? (
          <p>No videos saved yet</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="video-item">
              <video 
                src={video.src} 
                controls 
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <div className="video-info">
                <div className="item-title">{video.title}</div>
                <div className="video-meta">
                  {formatFileSize(video.size)} • {video.date}
                </div>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(video.id)}
                  style={{ marginTop: '0.5rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideosPage;