import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import FilesPage from './pages/FilesPage'
import LinksPage from './pages/LinksPage'
import PhotosPage from './pages/PhotosPage'
import RemindersPage from './pages/RemindersPage'
import ProjectsPage from './pages/ProjectsPage'
import Footer from './components/Footer'

function App() {
  const audioRef = useRef(null);
  const checkInterval = useRef(null);

  useEffect(() => {
    // Create audio element for global reminders
    audioRef.current = new Audio();
    audioRef.current.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
    
    // Set up global reminder checking
    checkInterval.current = setInterval(checkReminders, 60000); // Check every minute
    
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, []);

  const checkReminders = () => {
    const soundEnabled = localStorage.getItem('reminderSoundEnabled') !== 'false';
    if (!soundEnabled) return;
    
    const reminders = JSON.parse(localStorage.getItem('savedReminders')) || [];
    const now = new Date();
    
    const dueReminders = reminders.filter(reminder => {
      if (reminder.completed) return false;
      
      const reminderDate = new Date(reminder.date);
      const timeDiff = Math.abs(now - reminderDate);
      
      // If the reminder is due within the last minute
      return timeDiff < 60000 && reminderDate <= now;
    });
    
    if (dueReminders.length > 0) {
      playNotificationSound();
      showNotification(dueReminders);
    }
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Error playing sound:', e));
    }
  };

  const showNotification = (dueReminders) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      dueReminders.forEach(reminder => {
        new Notification('Reminder: ' + reminder.title, {
          body: `Your reminder "${reminder.title}" is due now!`
        });
      });
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="header">
          <div className="logo">AlgoKing Workspace</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/files">Files</Link></li>
            <li><Link to="/links">Links</Link></li>
            <li><Link to="/photos">Photos</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/reminders">Reminders</Link></li>
          </ul>
        </nav>
        
        <main className="content">
          <Routes>
            <Route path="/files" element={<FilesPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/" element={
              <div className="welcome">
                <h1>Welcome to AlgoKing Workspace</h1>
                <p>Store your files, links, photos, project ideas, and set reminders all in one place!</p>
                
                <div className="prayer-section">
                  <h2>Daily Prayer</h2>
                  <div className="prayer-text">
                    <p>Heavenly Father,</p>
                    <p>We come before You today with hearts full of gratitude and praise. We glorify Your holy name and acknowledge Your sovereignty over all creation. Thank You for the gift of life and for the blessings You bestow upon us each day.</p>
                    <p>Lord, we exalt You for Your love and mercy that never fail. Your wisdom and power are beyond our understanding, and we humbly seek Your guidance in all that we do. May our words, thoughts, and actions reflect Your glory and bring honor to Your name.</p>
                    <p>As we go about our day, help us to be a light to those around us. Let us show kindness, compassion, and love to everyone we encounter, so that they may see You in us. Strengthen us in our faith and fill us with Your Holy Spirit, that we may walk in Your ways and live according to Your will.</p>
                    <p>We thank You for Your son, Jesus Christ, who died for our sins and rose again, giving us the hope of eternal life. May we always remember His sacrifice and strive to live lives that are pleasing to You.</p>
                    <p>In Jesus' precious name, we pray.</p>
                    <p>Amen.</p>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App