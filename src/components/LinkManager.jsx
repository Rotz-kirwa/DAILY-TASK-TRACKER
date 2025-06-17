import React, { useState, useEffect } from 'react';
import './LinkManager.css';

const LinkManager = () => {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
    setLinks(savedLinks);
  }, []);

  const handleAddLink = () => {
    if (url && title) {
      const newLink = {
        id: Date.now(),
        url: url.startsWith('http') ? url : `https://${url}`,
        title,
        category: category || 'Uncategorized',
        date: new Date().toLocaleString()
      };
      
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      localStorage.setItem('savedLinks', JSON.stringify(updatedLinks));
      
      setUrl('');
      setTitle('');
      setCategory('');
    }
  };

  const handleDelete = (id) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    localStorage.setItem('savedLinks', JSON.stringify(updatedLinks));
  };

  // Group links by category
  const linksByCategory = links.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {});

  return (
    <div className="link-manager">
      <h2>Link Manager</h2>
      
      <div className="add-link-form">
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
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button 
          onClick={handleAddLink}
          disabled={!url || !title}
        >
          Add Link
        </button>
      </div>
      
      <div className="links-container">
        {Object.keys(linksByCategory).length === 0 ? (
          <p className="no-links">No links saved yet</p>
        ) : (
          Object.entries(linksByCategory).map(([category, categoryLinks]) => (
            <div key={category} className="category-section">
              <h3>{category}</h3>
              <ul className="links-list">
                {categoryLinks.map((link) => (
                  <li key={link.id} className="link-item">
                    <div className="link-info">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {link.title}
                      </a>
                      <span className="link-date">{link.date}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(link.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkManager;