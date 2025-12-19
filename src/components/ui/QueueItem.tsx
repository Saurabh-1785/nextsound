import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { FiX, FiMusic } from 'react-icons/fi';
import { ITrack } from '@/types';
import { getImageUrl, cn } from '@/utils';
import { Button } from './button';

interface QueueItemProps {
    track: ITrack;
    index: number;
    isCurrentTrack: boolean;
    onRemove: (index: number) => void;
    onPlay: (index: number) => void;
}

export const QueueItem: React.FC<QueueItemProps> = ({
    track,
    index,
    isCurrentTrack,
    onRemove,
    onPlay,
}) => {
    const displayTitle = track.title || track.name || 'Unknown Track';
    const displayArtist = track.artist || 'Unknown Artist';

    return (
        <Reorder.Item
            value={track}
            id={track.id}
            className={cn(
                "group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                isCurrentTrack && "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
            )}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onPlay(index)}
        >
            {/* Drag handle indicator */}
            <div className="flex-shrink-0 w-1 h-8 rounded-full bg-gray-300 dark:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Album artwork */}
            <div className="relative flex-shrink-0">
                <img
                    src={getImageUrl(track.poster_path)}
                    alt={displayTitle}
                    className={cn(
                        "w-12 h-12 rounded-md object-cover",
                        "dark:brightness-75 dark:contrast-110 dark:saturate-90"
                    )}
                />
                {isCurrentTrack && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md">
                        <FiMusic className="w-5 h-5 text-white animate-pulse" />
                    </div>
                )}
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
                <h4 className={cn(
                    "font-semibold text-sm truncate transition-colors duration-200",
                    isCurrentTrack
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                )}>
                    {displayTitle}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {displayArtist}
                </p>
            </div>

            {/* Queue position */}
            <div className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 font-mono">
                #{index + 1}
            </div>

            {/* Remove button */}
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(index);
                }}
                variant="ghost"
                size="icon"
                className={cn(
                    "flex-shrink-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                    "text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                )}
            >
                <FiX className="w-4 h-4" />
            </Button>
        </Reorder.Item>
    );
};
