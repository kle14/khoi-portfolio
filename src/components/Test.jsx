import React, { useState, useEffect, useRef, useCallback } from "react";
import About from "./About";
import Home from "./Home";
import { Quests } from "./Quests";
import { Misc } from "./Misc";
import { Radio } from "./Radio";
import clickSound from '../assets/pipboy-select-101soundboards.mp3';
import Cursor from "./Cursor";
import { RadioProvider, useRadio } from "./RadioContext";

const PipBoy = () => {
  return (
    <RadioProvider>
      <PipBoyContent />
    </RadioProvider>
  );
};

const PipBoyContent = () => {
  const [activeItem, setActiveItem] = useState("HOME");
  const clickAudioRef = useRef(new Audio(clickSound));
  const { playSong, playlists, currentPlaylist, hasInteractedWithRadio, setHasInteractedWithRadio } = useRadio();

  const playClickSound = useCallback(() => {
    clickAudioRef.current.currentTime = 0;
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

  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  const handleSetActiveItem = useCallback((item) => {
    setActiveItem(item);
    if (item === "RADIO" && !hasInteractedWithRadio && playlists[currentPlaylist].length > 0) {
      setHasInteractedWithRadio(true);
      playSong(playlists[currentPlaylist][0], 0);
    }
  }, [hasInteractedWithRadio, playlists, currentPlaylist, playSong, setHasInteractedWithRadio]);

  return (
    <div className="bbody">
      <Cursor />
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
            <ContentWrapper activeItem={activeItem} />
          </div>
          <div className="piece glow noclick"></div>
          <div className="piece scanlines noclick"></div>
        </div>
      </div>
    </div>
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

const ContentWrapper = ({ activeItem }) => {
  return (
    <div className="w-full h-full">
      {activeItem === "ABOUT" && <About />}
      {activeItem === "HOME" && <Home />}
      {activeItem === "QUESTS" && <Quests />}
      {activeItem === "MISC" && <Misc />}
      {activeItem === "RADIO" && <Radio />}
    </div>
  );
};

export default PipBoy;