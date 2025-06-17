import React, { useState, useEffect } from 'react';
import './FileUpload.css';
import StorageIndicator from './StorageIndicator';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem('savedFiles')) || [];
    setFileList(savedFiles);
  }, []);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size - limit to 2MB
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2MB limit. Please select a smaller file.');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError('');
      }
    }
  };

  const handleSave = () => {
    if (file && fileName) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const newFile = {
              id: Date.now(),
              name: fileName,
              originalName: file.name,
              type: file.type,
              size: file.size,
              data: event.target.result,
              date: new Date().toLocaleString()
            };
            
            const updatedFiles = [...fileList, newFile];
            localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
            setFileList(updatedFiles);
            
            setFile(null);
            setFileName('');
            setError('');
          } catch (e) {
            if (e.name === 'QuotaExceededError' || e.toString().includes('quota')) {
              setError('Storage limit exceeded. Please delete some files first.');
            } else {
              setError('Error saving file: ' + e.message);
            }
          }
        };
        reader.onerror = () => {
          setError('Error reading file.');
        };
        reader.readAsDataURL(file);
      } catch (e) {
        setError('Error processing file: ' + e.message);
      }
    }
  };

  const handleDelete = (id) => {
    const updatedFiles = fileList.filter(file => file.id !== id);
    setFileList(updatedFiles);
    localStorage.setItem('savedFiles', JSON.stringify(updatedFiles));
    setError('');
  };

  const getTotalStorageUsed = () => {
    return fileList.reduce((total, f) => total + f.size, 0) / (1024 * 1024);
  };

  return (
    <div className="file-upload">
      <h2>File Manager</h2>
      
      <StorageIndicator />
      
      <div className="storage-info">
        <p>Total files: {fileList.length}</p>
        <p>Storage used: {getTotalStorageUsed().toFixed(2)} MB</p>
        <p className="storage-note">Note: Browser storage is limited to ~5-10MB total</p>
      </div>
      
      <div className="upload-section">
        <input 
          type="text" 
          placeholder="Enter file name" 
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <input type="file" onChange={handleUpload} />
        <button 
          onClick={handleSave} 
          disabled={!file || !fileName}
        >
          Save File
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {file && (
        <div className="file-preview">
          <p>Selected file: {file.name} ({Math.round(file.size / 1024)} KB)</p>
        </div>
      )}
      
      <div className="file-list">
        <h3>Saved Files</h3>
        {fileList.length === 0 ? (
          <p>No files saved yet</p>
        ) : (
          <ul>
            {fileList.map((f) => (
              <li key={f.id} className="file-item">
                <div className="file-info">
                  <strong>{f.name}</strong>
                  <span>({f.originalName})</span>
                  <span className="file-meta">
                    {Math.round(f.size / 1024)} KB • {f.date}
                  </span>
                </div>
                <div className="file-actions">
                  <a 
                    href={f.data} 
                    download={f.originalName}
                    className="download-btn"
                  >
                    Download
                  </a>
                  <button 
                    onClick={() => handleDelete(f.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileUpload;