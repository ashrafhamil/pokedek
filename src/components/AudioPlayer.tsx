import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
    src: string;
}

const AudioPlayer = ({ src }: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true; // Loop the audio
        audioRef.current.volume = 0.1; // Set the volume

        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, [src]);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play().catch((error) => console.error('Error playing audio:', error));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <button
            onClick={handlePlayPause}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-700 transition duration-200 mt-4"
        >
            {isPlaying ? 'Pause Music' : 'Back to Littleroot Town'}
        </button>
    );
};

export default AudioPlayer;
