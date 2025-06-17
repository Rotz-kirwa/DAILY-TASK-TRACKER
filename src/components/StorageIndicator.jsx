import React, { useState, useEffect } from 'react';

const StorageIndicator = () => {
  const [usedSpace, setUsedSpace] = useState(0);
  const [totalSpace, setTotalSpace] = useState(5 * 1024 * 1024); // Default 5MB
  
  useEffect(() => {
    // Calculate current localStorage usage
    const calculateUsage = () => {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += (localStorage[key].length * 2) / 1024 / 1024; // Convert to MB
        }
      }
      setUsedSpace(total);
    };
    
    calculateUsage();
    
    // Try to estimate max storage
    try {
      let i = 0;
      let testKey = 'storage-test';
      let testString = 'A'.repeat(1024 * 1024); // 1MB string
      
      // Clean up any previous test
      localStorage.removeItem(testKey);
      
      // Try to determine storage limit
      try {
        for (i = 0; i < 10; i++) {
          localStorage.setItem(testKey + i, testString);
        }
      } catch (e) {
        // We've hit the limit
      } finally {
        // Clean up test data
        for (let j = 0; j < i; j++) {
          localStorage.removeItem(testKey + j);
        }
        
        // Set the estimated total (i MB)
        if (i > 0) {
          setTotalSpace(i * 1024 * 1024);
        }
      }
    } catch (e) {
      console.log('Could not determine storage limit:', e);
    }
    
    // Set up event listener for storage changes
    window.addEventListener('storage', calculateUsage);
    return () => window.removeEventListener('storage', calculateUsage);
  }, []);
  
  const percentUsed = Math.min(100, Math.round((usedSpace * 1024 * 1024 / totalSpace) * 100));
  
  return (
    <div className="storage-indicator">
      <div className="storage-bar">
        <div 
          className="storage-used" 
          style={{ width: `${percentUsed}%`, backgroundColor: percentUsed > 80 ? '#e74c3c' : '#3498db' }}
        ></div>
      </div>
      <div className="storage-text">
        {usedSpace.toFixed(2)} MB used of {(totalSpace / 1024 / 1024).toFixed(2)} MB
      </div>
    </div>
  );
};

export default StorageIndicator;