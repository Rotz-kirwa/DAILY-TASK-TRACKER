import React, { useState, useEffect } from 'react';

const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
    setLinks(savedLinks);
  }, []);

  const handleSave = () => {
    if (title && url) {
      const newLink = {
        id: Date.now(),
        title,
        url: url.startsWith('http') ? url : `https://${url}`,
        date: new Date().toLocaleString()
      };
      
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      localStorage.setItem('savedLinks', JSON.stringify(updatedLinks));
      
      setTitle('');
      setUrl('');
    }
  };

  const handleDelete = (id) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    localStorage.setItem('savedLinks', JSON.stringify(updatedLinks));
  };

  return (
    <div className="page-container">
      <h2>Link Manager</h2>
      
      <div>
        <input
          type="text"
          placeholder="Link Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleSave}>Save Link</button>
      </div>
      
      <div className="item-list">
        <h3>Saved Links</h3>
        {links.length === 0 ? (
          <p>No links saved yet</p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="item">
              <div className="item-header">
                <span className="item-title">{link.title}</span>
                <span className="item-date">{link.date}</span>
              </div>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.url}
              </a>
              <div style={{ marginTop: '1rem' }}>
                <button className="delete-btn" onClick={() => handleDelete(link.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LinksPage;