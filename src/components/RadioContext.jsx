import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const RadioContext = createContext();

export const useRadio = () => useContext(RadioContext);

export const RadioProvider = ({ children }) => {
    const [playlists, setPlaylists] = useState({
        jazz: [],
        classical: [],
        oldies: []
    });
    const [currentPlaylist, setCurrentPlaylist] = useState("jazz");
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRandom, setIsRandom] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [hasInteractedWithRadio, setHasInteractedWithRadio] = useState(false);
    const audioRef = useRef(null);


    useEffect(() => {
        const importAll = (r) => {
            return r.keys().map((fileName) => ({
                name: fileName.substr(2).replace(/\.[^/.]+$/, ""),
                audio: r(fileName)
            }));
        }

        const jazzFiles = importAll(require.context('./../jazz', false, /\.mp3$/));
        const classicalFiles = importAll(require.context('./../classical', false, /\.mp3$/));
        const oldiesFiles = importAll(require.context('./../oldies', false, /\.mp3$/));

        setPlaylists({
            jazz: jazzFiles,
            classical: classicalFiles,
            oldies: oldiesFiles,
        });

        if (jazzFiles.length > 0) {
            setCurrentSong(jazzFiles[0]);
        }
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            if (isRepeat) {
                audioRef.current.loop = true;
            } else {
                audioRef.current.loop = false;
            }
        }
    }, [isRepeat]);

    const playSong = useCallback(async (song, index) => {
        setCurrentSong(song);
        setCurrentIndex(index);
        if (audioRef.current) {
            audioRef.current.src = song.audio;
            try {
                await audioRef.current.play();
                setIsPlaying(true);
                setHasInteractedWithRadio(true);
            } catch (error) {
                console.error("Error playing audio:", error);
                setIsPlaying(false);
            }
        }
    }, []);


    const togglePlayPause = useCallback(async () => {
        if (audioRef.current) {
            try {
                if (isPlaying) {
                    await audioRef.current.pause();
                } else {
                    await audioRef.current.play();
                }
                setIsPlaying(!isPlaying);
                setHasInteractedWithRadio(true);
            } catch (error) {
                console.error("Error toggling play/pause:", error);
            }
        }
    }, [isPlaying]);

    const playRandomSong = useCallback(() => {
        const currentPlaylistSongs = playlists[currentPlaylist];
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * currentPlaylistSongs.length);
        } while (newIndex === currentIndex && currentPlaylistSongs.length > 1);
        playSong(currentPlaylistSongs[newIndex], newIndex);
    }, [currentIndex, playlists, currentPlaylist, playSong]);

    const playNextSong = useCallback(() => {
        if (isRandom) {
            playRandomSong();
        } else {
            const currentPlaylistSongs = playlists[currentPlaylist];
            const newIndex = (currentIndex + 1) % currentPlaylistSongs.length;
            playSong(currentPlaylistSongs[newIndex], newIndex);
        }
    }, [isRandom, playRandomSong, playlists, currentPlaylist, currentIndex, playSong]);

    const playPreviousSong = useCallback(() => {
        const currentPlaylistSongs = playlists[currentPlaylist];
        const newIndex = (currentIndex - 1 + currentPlaylistSongs.length) % currentPlaylistSongs.length;
        playSong(currentPlaylistSongs[newIndex], newIndex);
    }, [currentIndex, playlists, currentPlaylist, playSong]);

    const handlePlaylistChange = useCallback((newPlaylist) => {
        setCurrentPlaylist(newPlaylist);
        if (playlists[newPlaylist].length > 0) {
            playSong(playlists[newPlaylist][0], 0);
        }
    }, [playlists, playSong]);

    const toggleRandom = useCallback(() => {
        setIsRandom(prev => !prev);
    }, []);

    const toggleRepeat = useCallback(() => {
        setIsRepeat(prev => !prev);
    }, []);

    const handleSongEnd = useCallback(() => {
        if (isRepeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (isRandom) {
            playRandomSong();
        } else {
            playNextSong();
        }
    }, [isRepeat, isRandom, playRandomSong, playNextSong]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('ended', handleSongEnd);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('ended', handleSongEnd);
            }
        };
    }, [handleSongEnd]);

    return (
        <RadioContext.Provider value={{
            playlists,
            currentPlaylist,
            currentSong,
            currentIndex,
            isPlaying,
            isRandom,
            isRepeat,
            hasInteractedWithRadio,
            audioRef,
            playSong,
            togglePlayPause,
            playNextSong,
            playPreviousSong,
            handlePlaylistChange,
            toggleRandom,
            toggleRepeat,
            setHasInteractedWithRadio,
        }}>
            {children}
            <audio ref={audioRef} />
        </RadioContext.Provider>
    );
};