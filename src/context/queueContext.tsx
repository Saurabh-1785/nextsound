import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ITrack } from '@/types';

interface QueueContextType {
    queue: ITrack[];
    currentQueueIndex: number;
    isQueuePanelOpen: boolean;
    addToQueue: (track: ITrack) => void;
    removeFromQueue: (index: number) => void;
    reorderQueue: (startIndex: number, endIndex: number) => void;
    setQueue: (newQueue: ITrack[]) => void;
    clearQueue: () => void;
    playFromQueue: (index: number) => void;
    setCurrentQueueIndex: (index: number) => void;
    toggleQueuePanel: () => void;
    openQueuePanel: () => void;
    closeQueuePanel: () => void;
    getNextTrack: () => ITrack | null;
    getPreviousTrack: () => ITrack | null;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface QueueProviderProps {
    children: ReactNode;
}

export const QueueProvider: React.FC<QueueProviderProps> = ({ children }) => {
    const [queue, setQueue] = useState<ITrack[]>([]);
    const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(-1);
    const [isQueuePanelOpen, setIsQueuePanelOpen] = useState(false);

    const addToQueue = useCallback((track: ITrack) => {
        setQueue(prev => {
            // Check if track already exists in queue
            const exists = prev.some(t => t.id === track.id);
            if (exists) {
                console.log('Track already in queue:', track.name);
                return prev;
            }
            console.log('Adding to queue:', track.name);
            return [...prev, track];
        });
    }, []);

    const removeFromQueue = useCallback((index: number) => {
        setQueue(prev => {
            const newQueue = [...prev];
            newQueue.splice(index, 1);

            // Adjust current index if needed
            if (index < currentQueueIndex) {
                setCurrentQueueIndex(prev => prev - 1);
            } else if (index === currentQueueIndex) {
                // If removing current track, reset index
                setCurrentQueueIndex(-1);
            }

            return newQueue;
        });
    }, [currentQueueIndex]);

    const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
        setQueue(prev => {
            const newQueue = [...prev];
            const [removed] = newQueue.splice(startIndex, 1);
            newQueue.splice(endIndex, 0, removed);

            // Update current index if the current track was moved
            if (startIndex === currentQueueIndex) {
                setCurrentQueueIndex(endIndex);
            } else if (startIndex < currentQueueIndex && endIndex >= currentQueueIndex) {
                setCurrentQueueIndex(prev => prev - 1);
            } else if (startIndex > currentQueueIndex && endIndex <= currentQueueIndex) {
                setCurrentQueueIndex(prev => prev + 1);
            }

            return newQueue;
        });
    }, [currentQueueIndex]);

    const setQueueDirectly = useCallback((newQueue: ITrack[]) => {
        setQueue(newQueue);
    }, []);

    const clearQueue = useCallback(() => {
        setQueue([]);
        setCurrentQueueIndex(-1);
    }, []);

    const playFromQueue = useCallback((index: number) => {
        if (index >= 0 && index < queue.length) {
            setCurrentQueueIndex(index);
        }
    }, [queue.length]);

    const toggleQueuePanel = useCallback(() => {
        setIsQueuePanelOpen(prev => !prev);
    }, []);

    const openQueuePanel = useCallback(() => {
        setIsQueuePanelOpen(true);
    }, []);

    const closeQueuePanel = useCallback(() => {
        setIsQueuePanelOpen(false);
    }, []);

    const getNextTrack = useCallback((): ITrack | null => {
        if (queue.length === 0) return null;
        const nextIndex = currentQueueIndex + 1;
        if (nextIndex < queue.length) {
            return queue[nextIndex];
        }
        return null;
    }, [queue, currentQueueIndex]);

    const getPreviousTrack = useCallback((): ITrack | null => {
        if (queue.length === 0) return null;
        const prevIndex = currentQueueIndex - 1;
        if (prevIndex >= 0) {
            return queue[prevIndex];
        }
        return null;
    }, [queue, currentQueueIndex]);

    const value: QueueContextType = {
        queue,
        currentQueueIndex,
        isQueuePanelOpen,
        addToQueue,
        removeFromQueue,
        reorderQueue,
        setQueue: setQueueDirectly,
        clearQueue,
        playFromQueue,
        setCurrentQueueIndex,
        toggleQueuePanel,
        openQueuePanel,
        closeQueuePanel,
        getNextTrack,
        getPreviousTrack,
    };

    return (
        <QueueContext.Provider value={value}>
            {children}
        </QueueContext.Provider>
    );
};

export const useQueue = () => {
    const context = useContext(QueueContext);
    if (!context) {
        throw new Error('useQueue must be used within QueueProvider');
    }
    return context;
};
