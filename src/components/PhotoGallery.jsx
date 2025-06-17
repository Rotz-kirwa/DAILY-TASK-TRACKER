import React, { useState, useEffect } from 'react';
import './PhotoGallery.css';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos')) || [];
    setPhotos(savedPhotos);
  }, []);

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (photo && title) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now(),
          title,
          src: event.target.result,
          date: new Date().toLocaleString()
        };
        
        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        localStorage.setItem('savedPhotos', JSON.stringify(updatedPhotos));
        
        setPhoto(null);
        setTitle('');
      };
      reader.readAsDataURL(photo);
    }
  };

  const handleDelete = (id) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    localStorage.setItem('savedPhotos', JSON.stringify(updatedPhotos));
    if (selectedPhoto && selectedPhoto.id === id) {
      setSelectedPhoto(null);
    }
  };

  return (
    <div className="photo-gallery">
      <h2>Photo Gallery</h2>
      
      <div className="upload-section">
        <input
          type="text"
          placeholder="Photo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
        />
        <button 
          onClick={handleSave}
          disabled={!photo || !title}
        >
          Save Photo
        </button>
      </div>
      
      {photo && (
        <div className="photo-preview">
          <p>Selected photo: {photo.name}</p>
          <img 
            src={URL.createObjectURL(photo)} 
            alt="Preview" 
            className="preview-image"
          />
        </div>
      )}
      
      <div className="gallery-container">
        {photos.length === 0 ? (
          <p className="no-photos">No photos saved yet</p>
        ) : (
          <div className="photo-grid">
            {photos.map((p) => (
              <div key={p.id} className="photo-item">
                <img 
                  src={p.src} 
                  alt={p.title} 
                  onClick={() => setSelectedPhoto(p)}
                />
                <div className="photo-title">{p.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedPhoto && (
        <div className="photo-modal">
          <div className="modal-content">
            <span 
              className="close-button" 
              onClick={() => setSelectedPhoto(null)}
            >
              &times;
            </span>
            <img src={selectedPhoto.src} alt={selectedPhoto.title} />
            <div className="modal-info">
              <h3>{selectedPhoto.title}</h3>
              <p>Added on {selectedPhoto.date}</p>
              <button 
                onClick={() => handleDelete(selectedPhoto.id)}
                className="delete-btn"
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;