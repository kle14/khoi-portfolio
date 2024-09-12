import React, { useState, useEffect, useRef, useCallback } from "react";
import About from "./About";
import Home from "./Home";
import { Quests } from "./Quests";
import { Misc } from "./Misc";
import { Radio } from "./Radio";

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

  const playNextSong = useCallback(() => {
    const currentPlaylistSongs = playlists[currentPlaylist];
    const newIndex = (currentIndex + 1) % currentPlaylistSongs.length;
    playSong(currentPlaylistSongs[newIndex], newIndex);
  }, [currentIndex, playlists, currentPlaylist, playSong]);

  const handleSongEnd = useCallback(() => {
    playNextSong();
  }, [playNextSong]);

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
      <div id="frame" className="frame">
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
  currentPlaylist
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
        />
      )}
    </div>
  );
};

export default PipBoy;