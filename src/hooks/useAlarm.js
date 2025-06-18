import { useRef, useEffect } from 'react';

const useAlarm = () => {
  const audioRef = useRef(null);
  const alarmTimeoutRef = useRef(null);

  // Use local audio files that are guaranteed to work
  const motivationalSounds = [
    '/sounds/alarm.mp3',
    '/sounds/success.mp3',
    '/sounds/chime.mp3'
  ];

  useEffect(() => {
    // Create audio element for reminders
    audioRef.current = new Audio();
    audioRef.current.src = motivationalSounds[0];
    audioRef.current.loop = true; // Enable looping for continuous playback
    
    return () => {
      stopAlarm();
    };
  }, []);

  const playAlarm = () => {
    if (audioRef.current) {
      // Clear any existing timeout
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
      }
      
      // Try to play the sound
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        // Try a different sound
        tryNextSound(0);
      });
      
      // Stop the sound after 10 minutes
      alarmTimeoutRef.current = setTimeout(() => {
        stopAlarm();
      }, 10 * 60 * 1000); // 10 minutes in milliseconds
      
      // Store alarm state
      localStorage.setItem('alarmPlaying', 'true');
      localStorage.setItem('alarmStartTime', Date.now().toString());
    }
  };
  
  const tryNextSound = (index) => {
    if (index >= motivationalSounds.length) {
      console.error('All sounds failed to play');
      return;
    }
    
    audioRef.current.src = motivationalSounds[index];
    audioRef.current.play().catch(error => {
      console.error(`Sound ${index} failed:`, error);
      tryNextSound(index + 1);
    });
  };
  
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    
    // Clear alarm state
    localStorage.removeItem('alarmPlaying');
    localStorage.removeItem('alarmStartTime');
  };
  
  const changeMusic = () => {
    if (audioRef.current && isAlarmPlaying()) {
      let currentIndex = 0;
      
      // Find the current sound index
      for (let i = 0; i < motivationalSounds.length; i++) {
        if (audioRef.current.src.endsWith(motivationalSounds[i])) {
          currentIndex = i;
          break;
        }
      }
      
      const nextIndex = (currentIndex + 1) % motivationalSounds.length;
      
      audioRef.current.pause();
      audioRef.current.src = motivationalSounds[nextIndex];
      
      audioRef.current.play().catch(error => {
        console.error('Error changing audio:', error);
        tryNextSound((nextIndex + 1) % motivationalSounds.length);
      });
    }
  };
  
  const isAlarmPlaying = () => {
    return localStorage.getItem('alarmPlaying') === 'true';
  };
  
  return { playAlarm, stopAlarm, isAlarmPlaying, changeMusic };
};

export default useAlarm;