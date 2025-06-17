import React, { useState, useEffect } from 'react';
import './Reminder.css';

const Reminder = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    const savedReminders = JSON.parse(localStorage.getItem('savedReminders')) || [];
    setReminders(savedReminders);
  }, []);

  const handleAddReminder = () => {
    if (title && date) {
      const newReminder = {
        id: Date.now(),
        title,
        date,
        priority,
        completed: false,
        createdAt: new Date().toLocaleString()
      };
      
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      localStorage.setItem('savedReminders', JSON.stringify(updatedReminders));
      
      setTitle('');
      setDate('');
      setPriority('medium');
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

  // Sort reminders by date and completion status
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="reminder-container">
      <h2>Reminders</h2>
      
      <div className="add-reminder-form">
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
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button 
          onClick={handleAddReminder}
          disabled={!title || !date}
        >
          Add Reminder
        </button>
      </div>
      
      <div className="reminders-list">
        {sortedReminders.length === 0 ? (
          <p className="no-reminders">No reminders set</p>
        ) : (
          <ul>
            {sortedReminders.map((reminder) => {
              const isPast = new Date(reminder.date) < new Date();
              const isToday = new Date(reminder.date).toDateString() === new Date().toDateString();
              
              return (
                <li 
                  key={reminder.id} 
                  className={`reminder-item ${reminder.completed ? 'completed' : ''} ${isPast && !reminder.completed ? 'past-due' : ''} priority-${reminder.priority}`}
                >
                  <div className="reminder-checkbox">
                    <input
                      type="checkbox"
                      checked={reminder.completed}
                      onChange={() => toggleComplete(reminder.id)}
                    />
                  </div>
                  <div className="reminder-content">
                    <div className="reminder-title">
                      {reminder.title}
                      {isPast && !reminder.completed && <span className="past-due-label">Past Due</span>}
                      {isToday && !isPast && !reminder.completed && <span className="today-label">Today</span>}
                    </div>
                    <div className="reminder-date">
                      {new Date(reminder.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="reminder-actions">
                    <button 
                      onClick={() => handleDelete(reminder.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reminder;