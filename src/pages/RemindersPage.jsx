import React, { useState, useEffect, useRef } from 'react';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);
  const checkInterval = useRef(null);

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem('savedReminders')) || [];
    setReminders(savedReminders);
    
    // Load sound preference
    const soundPref = localStorage.getItem('reminderSoundEnabled');
    if (soundPref !== null) {
      setSoundEnabled(soundPref === 'true');
    }
    
    // Create audio element
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.src = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';
    
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, []);

  // Set up reminder checking
  useEffect(() => {
    // Check for due reminders every minute
    checkInterval.current = setInterval(checkReminders, 60000);
    
    // Also check immediately
    checkReminders();
    
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [reminders, soundEnabled]);

  const checkReminders = () => {
    if (!soundEnabled) return;
    
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
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const handleSave = () => {
    if (title && date) {
      const newReminder = {
        id: Date.now(),
        title,
        date,
        completed: false,
        createdAt: new Date().toLocaleString()
      };
      
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      localStorage.setItem('savedReminders', JSON.stringify(updatedReminders));
      
      setTitle('');
      setDate('');
    }
  };

  const toggleComplete = (id) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    );
    setReminders(updatedReminders);
    localStorage.setItem('savedReminders', JSON.stringify(updatedReminders));
  };

  const handleDelete = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    localStorage.setItem('savedReminders', JSON.stringify(updatedReminders));
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    localStorage.setItem('reminderSoundEnabled', newSoundEnabled);
    
    // Play a test sound when enabling
    if (newSoundEnabled) {
      playNotificationSound();
    }
  };

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Sort reminders by date and completion status
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="page-container">
      <h2>Reminders</h2>
      
      <div className="sound-toggle" style={{ marginBottom: '1rem' }}>
        <label>
          <input 
            type="checkbox" 
            checked={soundEnabled} 
            onChange={toggleSound} 
          />
          Enable sound notifications
        </label>
        <button 
          onClick={requestNotificationPermission}
          style={{ marginLeft: '1rem' }}
        >
          Enable browser notifications
        </button>
        <button 
          onClick={playNotificationSound}
          style={{ marginLeft: '1rem' }}
        >
          Test sound
        </button>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Reminder Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleSave}>Add Reminder</button>
      </div>
      
      <div className="item-list">
        <h3>Your Reminders</h3>
        {sortedReminders.length === 0 ? (
          <p>No reminders set</p>
        ) : (
          sortedReminders.map((reminder) => {
            const isPast = new Date(reminder.date) < new Date();
            
            return (
              <div 
                key={reminder.id} 
                className="item" 
                style={{ 
                  opacity: reminder.completed ? 0.7 : 1,
                  borderLeft: reminder.completed ? '4px solid #2ecc71' : 
                             isPast ? '4px solid #e74c3c' : '4px solid #3498db'
                }}
              >
                <div className="item-header">
                  <div>
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => toggleComplete(reminder.id)}
                      style={{ marginRight: '10px' }}
                    />
                    <span 
                      className="item-title"
                      style={{ 
                        textDecoration: reminder.completed ? 'line-through' : 'none'
                      }}
                    >
                      {reminder.title}
                    </span>
                    {isPast && !reminder.completed && (
                      <span style={{ 
                        color: 'white', 
                        background: '#e74c3c',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        marginLeft: '8px'
                      }}>
                        OVERDUE
                      </span>
                    )}
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(reminder.id)}>Delete</button>
                </div>
                <div className="item-date">Due: {new Date(reminder.date).toLocaleString()}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RemindersPage;