import React, { useState, useEffect, useCallback } from 'react'
import { HudBar } from './HudBar'
import { Backlight } from './Backlight';
import { Puzzle } from './Puzzle';
import { PuzzleAlter } from './PuzzleAlter'; // Assuming PuzzleAlter is in a separate file
import { Map } from './Map';

export const Misc = () => {
    const [active, setActive] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleActive = (index) => {
        setActive(index);
    };

    const ResponsivePuzzle = useCallback(() => {
        return windowWidth < 1024 ? <PuzzleAlter /> : <Puzzle />;
    }, [windowWidth]);

    return (
        <div className="tab-pane fade h-full">
            <HudBar title="Misc" />
            <div className="pip-body">
                <div className='flex p-1 overflow-hidden lg:flex-row flex-col absolute left-1 right-1 bottom-12 lg:bottom-3 top-7'>
                    <div className="lg:w-[35%] w-full lg:h-full h-fit flex lg:justify-start justify-center px-2">
                        <Options
                            active={active}
                            handleActive={handleActive}
                        />
                    </div>
                    {active === 0 && <Backlight />}
                    {active === 1 && <ResponsivePuzzle />}
                    {active === 2 && <Map />}
                </div>
            </div>
        </div>
    )
}

const Options = ({ active, handleActive }) => {
    return (
        <ul className="lg:text-base text-xs flex lg:flex-col flex-row justify-between lg:justify-start w-full">
            {['Themes', 'H#cK m3', 'Map'].map((item, index) => (
                <li
                    key={index}
                    className={`box-glow smallbox ${active === index ? 'active' : ''} py-0.5 my-1 cursor-pointer`}
                    onClick={() => handleActive(index)}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
};