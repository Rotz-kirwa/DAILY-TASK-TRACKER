import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import FilesPage from './pages/FilesPage'
import LinksPage from './pages/LinksPage'
import PhotosPage from './pages/PhotosPage'
import RemindersPage from './pages/RemindersPage'
import ProjectsPage from './pages/ProjectsPage'
import NotesPage from './pages/NotesPage'
import useAlarm from './hooks/useAlarm'

function App() {
  const checkInterval = useRef(null);
  const { playAlarm, stopAlarm, isAlarmPlaying } = useAlarm();

  useEffect(() => {
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
      // Store active reminders in localStorage to track them
      localStorage.setItem('activeReminders', JSON.stringify(dueReminders));
      
      // Play alarm sound for 10 minutes
      playAlarm();
      showNotification(dueReminders);
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
          <div className="logo">My Personal Workspace</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/files">Files</Link></li>
            <li><Link to="/links">Links</Link></li>
            <li><Link to="/photos">Photos</Link></li>
            <li><Link to="/notes">Notes</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/reminders">Reminders</Link></li>
          </ul>
        </nav>
        
        <main className="content">
          <Routes>
            <Route path="/files" element={<FilesPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="/photos" element={<PhotosPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/" element={
              <div className="welcome">
                <h1>BE THE BEST VERSION OF YOU</h1>
                <p>Store your files, links, photos, notes, project ideas, and set reminders all in one place!</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App