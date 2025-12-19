import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useQueue } from '@/context/queueContext';
import { ITrack } from '@/types';

interface AudioPlayerContextType {
  currentTrack: ITrack | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  isMinimized: boolean;
  playTrack: (track: ITrack) => void;
  togglePlay: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: () => void;
  toggleMinimize: () => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioPlayer = useAudioPlayer();
  const { getNextTrack, getPreviousTrack, setCurrentQueueIndex, queue } = useQueue();

  // Enhanced skipNext that uses queue
  const skipNext = useCallback(() => {
    const nextTrack = getNextTrack();
    if (nextTrack) {
      console.log('Playing next track from queue:', nextTrack.name);
      audioPlayer.playTrack(nextTrack);
      // Update queue index
      const currentIndex = queue.findIndex(t => t.id === audioPlayer.currentTrack?.id);
      if (currentIndex !== -1) {
        setCurrentQueueIndex(currentIndex + 1);
      }
    } else {
      console.log('No next track in queue');
      audioPlayer.skipNext();
    }
  }, [getNextTrack, audioPlayer, queue, setCurrentQueueIndex]);

  // Enhanced skipPrevious that uses queue
  const skipPrevious = useCallback(() => {
    const prevTrack = getPreviousTrack();
    if (prevTrack) {
      console.log('Playing previous track from queue:', prevTrack.name);
      audioPlayer.playTrack(prevTrack);
      // Update queue index
      const currentIndex = queue.findIndex(t => t.id === audioPlayer.currentTrack?.id);
      if (currentIndex !== -1) {
        setCurrentQueueIndex(currentIndex - 1);
      }
    } else {
      console.log('No previous track in queue');
      audioPlayer.skipPrevious();
    }
  }, [getPreviousTrack, audioPlayer, queue, setCurrentQueueIndex]);

  // Sync queue index when track changes
  useEffect(() => {
    if (audioPlayer.currentTrack) {
      const index = queue.findIndex(t => t.id === audioPlayer.currentTrack?.id);
      if (index !== -1) {
        setCurrentQueueIndex(index);
      }
    }
  }, [audioPlayer.currentTrack, queue, setCurrentQueueIndex]);

  const enhancedPlayer: AudioPlayerContextType = {
    ...audioPlayer,
    skipNext,
    skipPrevious,
  };

  return (
    <AudioPlayerContext.Provider value={enhancedPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  }
  return context;
};
