import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  Download
} from 'lucide-react';
import { VideoSource } from '@shared/schema';

interface VideoPlayerProps {
  sources: VideoSource[];
  title: string;
  episodeNumber: number;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPrevEpisode?: boolean;
  onComplete?: () => void;
  downloadUrl?: string;
}

const VideoPlayer = ({
  sources,
  title,
  episodeNumber,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode = false,
  hasPrevEpisode = false,
  onComplete,
  downloadUrl,
}: VideoPlayerProps) => {
  // Player state
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<number | null>(null);
  
  // Refs
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use the first source as default
  const videoUrl = sources.length > 0 ? sources[0].url : '';
  const effectiveDownloadUrl = downloadUrl || videoUrl;
  
  // Format time in MM:SS or HH:MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    } else {
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
  };
  
  // Handle play/pause toggling
  const handlePlayPause = () => {
    setPlaying(!playing);
  };
  
  // Handle seeking
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setPlayed(newTime / 100);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime / 100);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };
  
  // Handle mute toggle
  const handleMuteToggle = () => {
    setMuted(!muted);
  };
  
  // Handle fullscreen toggle
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };
  
  // Handle video progress
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setPlayed(state.played);
    setCurrentTime(state.playedSeconds);
    setLoaded(state.loaded);
    
    // Check for completion
    if (state.played > 0.99 && onComplete) {
      onComplete();
    }
  };
  
  // Handle duration change
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };
  
  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    setShowControls(true);
    
    // Clear any existing timeout
    if (controlsTimeout !== null) {
      window.clearTimeout(controlsTimeout);
    }
    
    // Set a new timeout to hide controls after 3 seconds if video is playing
    const timeout = window.setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };
  
  // Handle player click
  const handlePlayerClick = () => {
    // Toggle controls on mobile or if controls are hidden
    if (!showControls) {
      handleMouseMove();
    } else {
      // Toggle play/pause on desktop if controls are already showing
      handlePlayPause();
    }
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout !== null) {
        window.clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle shortcuts if input elements are focused
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'f':
          e.preventDefault();
          handleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          handleMuteToggle();
          break;
        case 'arrowright':
          e.preventDefault();
          if (playerRef.current) {
            const seekTo = Math.min(currentTime + 10, duration);
            playerRef.current.seekTo(seekTo / duration);
          }
          break;
        case 'arrowleft':
          e.preventDefault();
          if (playerRef.current) {
            const seekTo = Math.max(currentTime - 10, 0);
            playerRef.current.seekTo(seekTo / duration);
          }
          break;
        case 'n':
          if (hasNextEpisode && onNextEpisode) {
            e.preventDefault();
            onNextEpisode();
          }
          break;
        case 'p':
          if (hasPrevEpisode && onPrevEpisode) {
            e.preventDefault();
            onPrevEpisode();
          }
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handlePlayPause, handleFullscreen, handleMuteToggle, hasNextEpisode, 
      hasPrevEpisode, onNextEpisode, onPrevEpisode, currentTime, duration]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-none overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onClick={handlePlayerClick}
    >
      {/* Main ReactPlayer component */}
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onDuration={handleDuration}
        onProgress={handleProgress}
        progressInterval={1000}
        playsinline
        controls={false}
        config={{
          youtube: {
            playerVars: {
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              iv_load_policy: 3,
              playsinline: 1,
              showinfo: 0,
              controls: 0,
              origin: window.location.origin
            }
          },
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />
      
      {/* Play button overlay when paused */}
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button 
            onClick={handlePlayPause}
            className="bg-red-600/80 hover:bg-red-600 text-white p-5 rounded-full"
          >
            <Play className="w-10 h-10" />
          </button>
        </div>
      )}
      
      {/* Custom controls overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div className="flex items-center mb-2">
          <input 
            type="range"
            min={0}
            max={100}
            value={played * 100}
            onChange={handleSeekChange}
            className="w-full h-1 bg-gray-600 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ff3a3a ${played * 100}%, #4B5563 ${played * 100}%)`,
            }}
          />
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center justify-between">
          {/* Left controls: play/pause and time */}
          <div className="flex items-center space-x-4">
            <button onClick={handlePlayPause} className="text-white p-1 hover:bg-white/10 rounded-full">
              {playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={handleMuteToggle} className="text-white p-1 hover:bg-white/10 rounded-full">
                {muted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              
              <input
                type="range"
                min={0}
                max={100}
                value={volume * 100}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 appearance-none rounded-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, white ${volume * 100}%, #4B5563 ${volume * 100}%)`,
                }}
              />
            </div>
          </div>
          
          {/* Middle controls: prev/next episode */}
          <div className="flex items-center space-x-4">
            {hasPrevEpisode && (
              <button 
                onClick={onPrevEpisode}
                className="text-white p-1 hover:bg-white/10 rounded-full"
                title="Previous Episode"
              >
                <SkipBack className="w-5 h-5" />
              </button>
            )}
            
            {hasNextEpisode && (
              <button 
                onClick={onNextEpisode}
                className="text-white p-1 hover:bg-white/10 rounded-full"
                title="Next Episode"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Right controls: download, fullscreen */}
          <div className="flex items-center space-x-4">
            {effectiveDownloadUrl && (
              <a 
                href={effectiveDownloadUrl}
                download
                className="text-white p-1 hover:bg-white/10 rounded-full"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
            
            <button 
              onClick={handleFullscreen}
              className="text-white p-1 hover:bg-white/10 rounded-full"
              title="Toggle Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;