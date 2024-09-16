import React, { useState, useEffect, useRef, useCallback } from "react";
import About from "./About";
import Home from "./Home";
import { Quests } from "./Quests";
import { Misc } from "./Misc";
import { Radio } from "./Radio";
import clickSound from '../assets/pipboy-select-101soundboards.mp3';
import Cursor from "./Cursor";  // Import the new Cursor component


const PipBoy = () => {
  const [activeItem, setActiveItem] = useState("HOME");
  const [playlists, setPlaylists] = useState({
    jazz: [],
    classical: [],
    oldies: []
  });
  const [currentPlaylist, setCurrentPlaylist] = useState("jazz");
  const [currentSong, setCurrentSong] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [hasInteractedWithRadio, setHasInteractedWithRadio] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const clickAudioRef = useRef(new Audio(clickSound));

  const playClickSound = useCallback(() => {
    clickAudioRef.current.currentTime = 0; // Reset the audio to the beginning
    clickAudioRef.current.play();
  }, []);

  useEffect(() => {
    const handleClick = () => {
      playClickSound();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [playClickSound]);


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

  const toggleRandom = useCallback(() => {
    setIsRandom(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeat(prev => !prev);
  }, []);

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
    const setVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);

    // Import songs for both playlists
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

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

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

  const playPreviousSong = useCallback(() => {
    const currentPlaylistSongs = playlists[currentPlaylist];
    const newIndex = (currentIndex - 1 + currentPlaylistSongs.length) % currentPlaylistSongs.length;
    playSong(currentPlaylistSongs[newIndex], newIndex);
  }, [currentIndex, playlists, currentPlaylist, playSong]);

  const handleSetActiveItem = useCallback((item) => {
    setActiveItem(item);
    if (item === "RADIO" && !hasInteractedWithRadio && playlists[currentPlaylist].length > 0) {
      playSong(playlists[currentPlaylist][0], 0);
    }
  }, [hasInteractedWithRadio, playlists, currentPlaylist, playSong]);

  const handlePlaylistChange = useCallback((newPlaylist) => {
    setCurrentPlaylist(newPlaylist);
    if (playlists[newPlaylist].length > 0) {
      playSong(playlists[newPlaylist][0], 0);
    }
  }, [playlists, playSong]);

  return (
    <body>
      <Cursor />  {/* Add the Cursor component here */}
      <div id="frame" className="frame" onClick={playClickSound}>
        <div className="piece output">
          <div className="pipboy">
            <ul className="pip-foot">
              <NavItem
                text="Home"
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
              />
              <NavItem
                text="About"
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
              />
              <NavItem
                text="Quests"
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
              />
              <NavItem
                text="Misc"
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
              />
              <NavItem
                text="Radio"
                activeItem={activeItem}
                setActiveItem={handleSetActiveItem}
              />
            </ul>
            <ContentWrapper
              activeItem={activeItem}
              songs={playlists[currentPlaylist]}
              currentSong={currentSong}
              currentIndex={currentIndex}
              isPlaying={isPlaying}
              playSong={playSong}
              togglePlayPause={togglePlayPause}
              playPreviousSong={playPreviousSong}
              playNextSong={playNextSong}
              audioRef={audioRef}
              handlePlaylistChange={handlePlaylistChange}
              currentPlaylist={currentPlaylist}
              isRandom={isRandom}
              toggleRandom={toggleRandom}
              isRepeat={isRepeat}
              toggleRepeat={toggleRepeat}
            />
          </div>
          <div className="piece glow noclick"></div>
          <div className="piece scanlines noclick"></div>
        </div>
      </div>
      <audio ref={audioRef} />
    </body>
  );
};

const NavItem = ({ text, activeItem, setActiveItem }) => {
  const isActive = text.toUpperCase() === activeItem;

  return (
    <li className={isActive ? "active" : ""}>
      <a
        href={`#${text.toLowerCase()}`}
        className={`cursor-pointer ${isActive ? "active" : ""}`}
        onClick={() => setActiveItem(text.toUpperCase())}
      >
        {text}
      </a>
    </li>
  );
};

const ContentWrapper = ({
  activeItem,
  songs,
  currentSong,
  currentIndex,
  isPlaying,
  playSong,
  togglePlayPause,
  playPreviousSong,
  playNextSong,
  audioRef,
  handlePlaylistChange,
  currentPlaylist,
  isRandom,
  toggleRandom,
  isRepeat,
  toggleRepeat

}) => {
  return (
    <div className="w-full h-full">
      {activeItem === "ABOUT" && <About />}
      {activeItem === "HOME" && <Home />}
      {activeItem === "QUESTS" && <Quests />}
      {activeItem === "MISC" && <Misc />}
      {activeItem === "RADIO" && (
        <Radio
          songs={songs}
          currentSong={currentSong}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          playSong={playSong}
          togglePlayPause={togglePlayPause}
          playPreviousSong={playPreviousSong}
          playNextSong={playNextSong}
          audioRef={audioRef}
          handlePlaylistChange={handlePlaylistChange}
          currentPlaylist={currentPlaylist}
          isRandom={isRandom}
          toggleRandom={toggleRandom}
          isRepeat={isRepeat}
          toggleRepeat={toggleRepeat}
        />
      )}
    </div>
  );
};

export default PipBoy;