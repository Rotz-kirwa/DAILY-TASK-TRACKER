import React, { useState, useEffect } from 'react';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('savedFiles')) || [];
    setFiles(savedFiles);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSave = () => {
    if (selectedFile && fileName) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const newFile = {
          id: Date.now(),
          name: fileName,
          originalName: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          data: event.target.result,
          date: new Date().toLocaleString()
        };
        
        const updatedFiles = [...files, newFile];
        setFiles(updatedFiles);
        localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
        
        setFileName('');
        setSelectedFile(null);
        // Reset the file input
        document.getElementById('file-input').value = '';
      };
      
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDelete = (id) => {
    const updatedFiles = files.filter(file => file.id !== id);
    setFiles(updatedFiles);
    localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="page-container background-image">
      <h2>File Manager</h2>
      
      <div>
        <input
          type="text"
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
        />
        <button 
          onClick={handleSave}
          disabled={!selectedFile || !fileName}
        >
          Save File
        </button>
      </div>
      
      <div className="item-list">
        <h3>Saved Files</h3>
        {files.length === 0 ? (
          <p>No files saved yet</p>
        ) : (
          files.map((file) => (
            <div key={file.id} className="item">
              <div className="item-header">
                <span className="item-title">{file.name}</span>
                <span className="item-date">{file.date}</span>
              </div>
              <p>Type: {file.type || 'Unknown'} | Size: {formatFileSize(file.size)}</p>
              <div style={{ marginTop: '1rem' }}>
                <a 
                  href={file.data} 
                  download={file.originalName}
                  className="download-btn"
                >
                  Download
                </a>
                <button className="delete-btn" onClick={() => handleDelete(file.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FilesPage;