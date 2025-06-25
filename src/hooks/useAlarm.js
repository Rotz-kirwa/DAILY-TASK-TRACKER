import { useRef, useState, useEffect } from 'react';

const useAlarm = () => {
  const audioRef = useRef(null);
  const alarmTimeoutRef = useRef(null);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);

  // Use local audio files
  const motivationalSounds = [
    '/sounds/alarm.mp3',
    '/sounds/success.mp3',
    '/sounds/chime.mp3',
    'youtube' // Special case for YouTube
  ];

  useEffect(() => {
    // Create audio element for reminders
    audioRef.current = new Audio();
    audioRef.current.src = motivationalSounds[0];
    audioRef.current.loop = true; // Enable looping for continuous playback
    
    // Load saved sound preference
    const savedIndex = localStorage.getItem('alarmSoundIndex');
    if (savedIndex !== null) {
      setCurrentSoundIndex(parseInt(savedIndex, 10));
    }
    
    return () => {
      stopAlarm();
    };
  }, []);

  const playAlarm = () => {
    // Stop any currently playing audio
    stopAlarm();
    
    // Clear any existing timeout
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
    }
    
    if (currentSoundIndex === 3) {
      // YouTube option - create a YouTube player in a hidden div
      const container = document.getElementById('youtube-audio-container') || 
                        createYouTubeContainer();
      
      container.innerHTML = `
        <iframe 
          id="youtube-audio" 
          width="0" 
          height="0" 
          src="https://www.youtube.com/embed/bjqR-uwooWQ?autoplay=1&loop=1&playlist=bjqR-uwooWQ" 
          allow="autoplay"
          style="display:none">
        </iframe>
      `;
    } else {
      // Regular audio
      audioRef.current.src = motivationalSounds[currentSoundIndex];
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    
    // Stop the sound after 10 minutes
    alarmTimeoutRef.current = setTimeout(() => {
      stopAlarm();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
    
    // Store alarm state
    localStorage.setItem('alarmPlaying', 'true');
    localStorage.setItem('alarmStartTime', Date.now().toString());
    localStorage.setItem('alarmSoundIndex', currentSoundIndex.toString());
  };
  
  const createYouTubeContainer = () => {
    const container = document.createElement('div');
    container.id = 'youtube-audio-container';
    container.style.display = 'none';
    document.body.appendChild(container);
    return container;
  };
  
  const stopAlarm = () => {
    // Stop regular audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop YouTube audio
    const youtubeContainer = document.getElementById('youtube-audio-container');
    if (youtubeContainer) {
      youtubeContainer.innerHTML = '';
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
    // Cycle to the next sound
    const nextIndex = (currentSoundIndex + 1) % motivationalSounds.length;
    setCurrentSoundIndex(nextIndex);
    localStorage.setItem('alarmSoundIndex', nextIndex.toString());
    
    // If alarm is currently playing, switch to the new sound
    if (isAlarmPlaying()) {
      playAlarm();
    }
  };
  
  const isAlarmPlaying = () => {
    return localStorage.getItem('alarmPlaying') === 'true';
  };
  
  const getCurrentSoundName = () => {
    const names = [
      "Beep Sound",
      "Success Sound",
      "Bell Chime",
      "Motivational YouTube"
    ];
    return names[currentSoundIndex];
  };
  
  return { 
    playAlarm, 
    stopAlarm, 
    isAlarmPlaying, 
    changeMusic,
    getCurrentSoundName
  };
};

export default useAlarm;