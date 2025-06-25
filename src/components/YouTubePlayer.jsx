import React from 'react';

const YouTubePlayer = ({ videoId }) => {
  return (
    <div className="youtube-player-wrapper" style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <div 
        className="youtube-player-responsive" 
        style={{ 
          position: 'relative',
          paddingBottom: '56.25%', /* 16:9 aspect ratio */
          height: 0,
          overflow: 'hidden',
          maxWidth: '100%',
          borderRadius: '8px'
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubePlayer;