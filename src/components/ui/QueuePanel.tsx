import React, { useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { FiX, FiList, FiTrash2 } from 'react-icons/fi';
import { useQueue } from '@/context/queueContext';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';
import { QueueItem } from './QueueItem';
import { Button } from './button';
import { cn } from '@/utils';
import { ITrack } from '@/types';

export const QueuePanel: React.FC = () => {
    const {
        queue,
        currentQueueIndex,
        isQueuePanelOpen,
        removeFromQueue,
        setQueue,
        clearQueue,
        closeQueuePanel,
        playFromQueue,
    } = useQueue();

    const { playTrack, currentTrack } = useAudioPlayerContext();

    // Handle escape key to close panel
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isQueuePanelOpen) {
                closeQueuePanel();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isQueuePanelOpen, closeQueuePanel]);

    const handlePlayFromQueue = (index: number) => {
        const track = queue[index];
        if (track) {
            playFromQueue(index);
            playTrack(track);
        }
    };

    const handleReorder = (newQueue: ITrack[]) => {
        setQueue(newQueue);
    };

    return (
        <>
            {/* Backdrop overlay */}
            <AnimatePresence>
                {isQueuePanelOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={closeQueuePanel}
                    />
                )}
            </AnimatePresence>

            {/* Queue Panel */}
            <AnimatePresence>
                {isQueuePanelOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <FiList className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Queue
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ({queue.length})
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {queue.length > 0 && (
                                    <Button
                                        onClick={clearQueue}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                                        title="Clear queue"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    onClick={closeQueuePanel}
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <FiX className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Currently Playing Section */}
                        {currentTrack && (
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                                    Now Playing
                                </p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={currentTrack.poster_path}
                                        alt={currentTrack.title || currentTrack.name}
                                        className="w-14 h-14 rounded-lg object-cover shadow-md dark:brightness-75 dark:contrast-110 dark:saturate-90"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                                            {currentTrack.title || currentTrack.name || 'Unknown Track'}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                            {currentTrack.artist || 'Unknown Artist'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Queue List */}
                        <div className="flex-1 overflow-y-auto">
                            {queue.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                        <FiList className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        Your queue is empty
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                                        Add songs to your queue by clicking the "Add to Queue" button on any track
                                    </p>
                                </div>
                            ) : (
                                <Reorder.Group
                                    axis="y"
                                    values={queue}
                                    onReorder={handleReorder}
                                    className="p-2 space-y-1"
                                >
                                    {queue.map((track, index) => (
                                        <QueueItem
                                            key={track.id}
                                            track={track}
                                            index={index}
                                            isCurrentTrack={index === currentQueueIndex}
                                            onRemove={removeFromQueue}
                                            onPlay={handlePlayFromQueue}
                                        />
                                    ))}
                                </Reorder.Group>
                            )}
                        </div>

                        {/* Footer info */}
                        {queue.length > 0 && (
                            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                    Drag to reorder • Click to play • Hover to remove
                                </p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
