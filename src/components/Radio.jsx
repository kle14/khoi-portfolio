import React, { useState, useEffect } from 'react';
import { HudBar } from './HudBar';
import testimg from './../assets/vinyl.gif'
import { FaRegCirclePause } from "react-icons/fa6";
import { LiaRandomSolid } from "react-icons/lia";
import { BiSkipNextCircle } from "react-icons/bi";
import { BiSkipPreviousCircle } from "react-icons/bi";
import { MdLoop } from "react-icons/md";
import { FaRegCirclePlay } from "react-icons/fa6";

export const Radio = ({
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
    const [active, setActive] = useState(() => {
        switch (currentPlaylist) {
            case 'jazz': return 0;
            case 'classical': return 1;
            case 'oldies': return 2;
            default: return 0;
        }
    });
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        switch (currentPlaylist) {
            case 'jazz': setActive(0); break;
            case 'classical': setActive(1); break;
            case 'oldies': setActive(2); break;
            default: setActive(0); break;
        }
    }, [currentPlaylist]);

    const handleActive = (index) => {
        setActive(index);
        const playlist = index === 0 ? 'jazz' : index === 1 ? 'classical' : 'oldies';
        handlePlaylistChange(playlist);
    }

    useEffect(() => {
        const audio = audioRef.current;
        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, [audioRef]);

    useEffect(() => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        }
    }, [currentSong, audioRef]);

    const handleSeek = (e) => {
        const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
        audioRef.current.currentTime = seekTime;
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    return (
        <div className='tab-pane fade h-full'>
            <HudBar title="Radio" />
            <div className='pip-body'>
                <div className='flex p-1 overflow-hidden md:flex-row flex-col absolute left-1 right-1 bottom-12 2xl:bottom-3 top-7 2xl:top-7'>
                    <div className='md:w-2/5 max-sm:h-[40%] h-[50%] md:h-full flex flex-col'>
                        <div className='h-fit lg:mb-5 mb-1'>
                            <Option
                                active={active}
                                handleActive={handleActive}
                            />
                        </div>

                        <div className='h-full border-style overflow-y-scroll p-2'>
                            {songs.map((song, index) => (
                                <div
                                    key={index}
                                    className={`text-xs my-0.5 cursor-pointer box-glow p-1 ${currentIndex === index ? 'text-primary' : 'text-secondary'}`}
                                    onClick={() => playSong(song, index)}
                                >
                                    {song.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='md:w-3/5 flex flex-col max-md:h-full'>
                        <div className='h-2/3 flex justify-center items-center'>
                            <img src={testimg} alt="" className='w-[15rem] h-[15rem]' />
                        </div>
                        <div className='h-1/3 flex flex-col'>
                            <div className='h-1/2 flex flex-row justify-center text-2xl'>
                                <div className='flex flex-row justify-between items-center lg:w-[50%]'>
                                    <LiaRandomSolid size={40} />
                                    <BiSkipPreviousCircle size={40} onClick={playPreviousSong} className="cursor-pointer" />
                                    {isPlaying ? (
                                        <FaRegCirclePause size={45} onClick={togglePlayPause} className="cursor-pointer" />
                                    ) : (
                                        <FaRegCirclePlay size={45} onClick={togglePlayPause} className="cursor-pointer" />
                                    )}
                                    <BiSkipNextCircle size={40} onClick={playNextSong} className="cursor-pointer" />
                                    <MdLoop size={40} />
                                </div>
                            </div>
                            <div className='h-1/2 flex flex-col justify-center items-center'>
                                <div className='w-full px-10'>
                                    <div
                                        className='w-full h-2 bg-secondary cursor-pointer border-style'
                                        onClick={handleSeek}
                                    >
                                        <div
                                            className='h-full bg-primary'
                                            style={{ width: `${(currentTime / duration) * 100}%` }}
                                        />
                                    </div>
                                    <div className='flex justify-between text-xs mt-1'>
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Option = ({ active, handleActive }) => {
    return (
        <ul className='md:text-base text-xs flex md:flex-col flex-row justify-between md:justify-start w-full'>
            {['Jazz', 'Classical', 'Oldies'].map((item, index) => (
                <li
                    key={index}
                    className={`box-glow smallbox ${active === index ? 'active' : ''} py-0.5 my-1 cursor-pointer`}
                    onClick={() => handleActive(index)}
                >
                    {item}
                </li>
            ))}
        </ul>
    )
}