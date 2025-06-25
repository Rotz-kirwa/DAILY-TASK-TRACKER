import React, { useState, useEffect, useRef } from 'react';
import useAlarm from '../hooks/useAlarm';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [isDaily, setIsDaily] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const checkInterval = useRef(null);
  const { playAlarm, stopAlarm, isAlarmPlaying, changeMusic, getCurrentSoundName } = useAlarm();

  // Load reminders from localStorage
  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem('savedReminders')) || [];
    setReminders(savedReminders);
    
    // Load sound preference
    const soundPref = localStorage.getItem('reminderSoundEnabled');
    if (soundPref !== null) {
      setSoundEnabled(soundPref === 'true');
    }
    
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
      
      if (reminder.isDaily) {
        // For daily reminders, check if it's due today and not completed today
        const lastCompleted = reminder.lastCompleted ? new Date(reminder.lastCompleted) : null;
        
        // Check if the time matches (hour and minute)
        const timeMatches = 
          reminderDate.getHours() === now.getHours() && 
          reminderDate.getMinutes() === now.getMinutes();
        
        // Check if it was already completed today
        const completedToday = lastCompleted && 
          lastCompleted.getDate() === now.getDate() &&
          lastCompleted.getMonth() === now.getMonth() &&
          lastCompleted.getFullYear() === now.getFullYear();
        
        return timeMatches && !completedToday;
      } else {
        // For regular reminders, check if it's due within the last minute
        const timeDiff = Math.abs(now - reminderDate);
        return timeDiff < 60000 && reminderDate <= now;
      }
    });
    
    if (dueReminders.length > 0) {
      playNotificationSound();
      showNotification(dueReminders);
    }
  };

  const playNotificationSound = () => {
    playAlarm();
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
        isDaily,
        completed: false,
        lastCompleted: null,
        createdAt: new Date().toLocaleString()
      };
      
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      localStorage.setItem('savedReminders', JSON.stringify(updatedReminders));
      
      setTitle('');
      setDate('');
      setIsDaily(false);
    }
  };

  const toggleComplete = (id) => {
    const now = new Date();
    
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === id) {
        if (reminder.isDaily) {
          // For daily reminders, just update lastCompleted instead of marking as completed
          return { 
            ...reminder, 
            lastCompleted: now.toISOString(),
            completed: false // Keep it active
          };
        } else {
          // For regular reminders, toggle completed status
          return { ...reminder, completed: !reminder.completed };
        }
      }
      return reminder;
    });
    
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
          onClick={playAlarm}
          style={{ marginLeft: '1rem' }}
        >
          Test sound
        </button>
        {isAlarmPlaying() && (
          <>
            <button 
              onClick={stopAlarm}
              style={{ 
                marginLeft: '1rem',
                backgroundColor: '#e74c3c'
              }}
            >
              Stop Alarm
            </button>
            <button 
              onClick={changeMusic}
              style={{ 
                marginLeft: '1rem',
                backgroundColor: '#3498db'
              }}
            >
              Change Music ({getCurrentSoundName()})
            </button>
          </>
        )}
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
        <div style={{ margin: '0.5rem 0' }}>
          <label>
            <input 
              type="checkbox" 
              checked={isDaily} 
              onChange={() => setIsDaily(!isDaily)} 
            />
            Daily recurring reminder
          </label>
          {isDaily && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
              (Will repeat daily at the specified time)
            </span>
          )}
        </div>
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
                             reminder.isDaily ? '4px solid #9b59b6' :
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
                    {isPast && !reminder.completed && !reminder.isDaily && (
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
                    {reminder.isDaily && (
                      <span style={{ 
                        color: 'white', 
                        background: '#9b59b6',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '0.7rem',
                        marginLeft: '8px'
                      }}>
                        DAILY
                      </span>
                    )}
                  </div>
                  <button className="delete-btn" onClick={() => handleDelete(reminder.id)}>Delete</button>
                </div>
                <div className="item-date">
                  {reminder.isDaily ? (
                    <>
                      <span>Daily at {new Date(reminder.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {reminder.lastCompleted && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#7f8c8d' }}>
                          (Last completed: {new Date(reminder.lastCompleted).toLocaleDateString()})
                        </span>
                      )}
                    </>
                  ) : (
                    <>Due: {new Date(reminder.date).toLocaleString()}</>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RemindersPage;