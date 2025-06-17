import React, { useState, useEffect } from 'react';

const PhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos')) || [];
    setPhotos(savedPhotos);
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        if (!title) {
          setTitle(file.name.split('.')[0]);
        }
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleSave = () => {
    if (selectedImage && title) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now(),
          title,
          url: event.target.result,
          date: new Date().toLocaleString()
        };
        
        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        localStorage.setItem('savedPhotos', JSON.stringify(updatedPhotos));
        
        setTitle('');
        setSelectedImage(null);
        // Reset the file input
        document.getElementById('image-input').value = '';
      };
      
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleDelete = (id) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    setPhotos(updatedPhotos);
    localStorage.setItem('savedPhotos', JSON.stringify(updatedPhotos));
  };

  return (
    <div className="page-container">
      <h2>Photo Gallery</h2>
      
      <div>
        <input
          type="text"
          placeholder="Photo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {selectedImage && (
          <div style={{ marginBottom: '1rem' }}>
            <p>Selected image: {selectedImage.name}</p>
            <img 
              src={URL.createObjectURL(selectedImage)} 
              alt="Preview" 
              style={{ maxWidth: '200px', maxHeight: '150px' }} 
            />
          </div>
        )}
        <button 
          onClick={handleSave}
          disabled={!selectedImage || !title}
        >
          Save Photo
        </button>
      </div>
      
      <div className="photo-grid">
        {photos.length === 0 ? (
          <p>No photos saved yet</p>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img src={photo.url} alt={photo.title} />
              <div style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: 'rgba(0,0,0,0.7)', 
                color: 'white',
                padding: '0.5rem'
              }}>
                <div className="item-title">{photo.title}</div>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(photo.id)}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginTop: '0.3rem' }}
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

export default PhotosPage;