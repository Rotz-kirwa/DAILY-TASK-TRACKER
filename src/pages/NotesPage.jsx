import React, { useState, useEffect } from 'react';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
    setNotes(savedNotes);
  }, []);

  const handleSave = () => {
    if (title && content) {
      if (editingId) {
        // Update existing note
        const updatedNotes = notes.map(note => 
          note.id === editingId ? 
          { ...note, title, content, lastEdited: new Date().toLocaleString() } : 
          note
        );
        setNotes(updatedNotes);
        localStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
        setEditingId(null);
      } else {
        // Create new note
        const newNote = {
          id: Date.now(),
          title,
          content,
          date: new Date().toLocaleString(),
          lastEdited: new Date().toLocaleString()
        };
        
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        localStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
      }
      
      setTitle('');
      setContent('');
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
    
    if (editingId === id) {
      setTitle('');
      setContent('');
      setEditingId(null);
    }
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2>Notes</h2>
      
      <div className="note-form">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="5"
        />
        <div className="button-group">
          <button onClick={handleSave}>
            {editingId ? 'Update Note' : 'Save Note'}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="item-list">
        <h3>Your Notes {filteredNotes.length > 0 && `(${filteredNotes.length})`}</h3>
        {filteredNotes.length === 0 ? (
          <p>{searchTerm ? 'No notes match your search' : 'No notes saved yet'}</p>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="item note-item">
              <div className="item-header">
                <span className="item-title">{note.title}</span>
                <span className="item-date">Created: {note.date}</span>
              </div>
              <div className="note-content">
                {note.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              {note.lastEdited !== note.date && (
                <div className="item-edited">Last edited: {note.lastEdited}</div>
              )}
              <div className="button-group" style={{ marginTop: '1rem' }}>
                <button onClick={() => handleEdit(note)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(note.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesPage;