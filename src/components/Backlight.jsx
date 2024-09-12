import React, { useState, useEffect } from 'react';

export const Backlight = () => {
    const colors = ['Amber', 'Red', 'Green', 'Blue', 'Yellow', 'Purple'];

    const colorValues = {
        amber: { main: '255, 170, 60', alt: '128, 75, 20' },
        red: { main: '255, 0, 0', alt: '128, 0, 0' },
        green: { main: '0, 255, 0', alt: '0, 128, 0' },
        blue: { main: '50, 150, 255', alt: '20, 80, 160' },
        yellow: { main: '255, 255, 0', alt: '128, 128, 0' },
        purple: { main: '128, 0, 128', alt: '64, 0, 64' },
        default: { main: '255, 255, 255', alt: '128, 128, 128' }
    };

    const getColorValues = (color) => colorValues[color.toLowerCase()] || colorValues.default;

    const getInitialIndex = () => {
        const currentColor = document.documentElement.style.getPropertyValue('--main').trim();
        const colorToIndex = {
            '255, 170, 60': 0,
            '255, 0, 0': 1,
            '0, 255, 0': 2,
            '50, 150, 255': 3,
            '255, 255, 0': 4,
            '128, 0, 128': 5
        };
        return colorToIndex[currentColor] ?? 0;
    };

    const [active, setActive] = useState(getInitialIndex());

    const handleActive = (index, color) => {
        setActive(index);
        changeRootColor(color);
    };

    const changeRootColor = (color) => {
        const root = document.documentElement;
        const { main, alt } = getColorValues(color);
        root.style.setProperty('--main', main);
        root.style.setProperty('--alt', alt);
    };

    useEffect(() => {
        setActive(getInitialIndex());
    }, []);

    return (
        <div className='w-full h-full'>
            <p className='flex justify-center m-2'>
                Select backlight color
            </p>
            <div className='h-[60%] p-3 flex flex-wrap justify-center'>
                {colors.map((color, index) => (
                    <div
                        key={index}
                        className={`w-[30%] md:h-[30%] h-[40%] border-style flex justify-center items-center m-2 cursor-pointer ${active === index ? 'text-black' : 'box-glow'}`}
                        onClick={() => handleActive(index, color)}
                        style={{ backgroundColor: active === index ? `rgb(${getColorValues(color).main})` : 'transparent' }}
                    >
                        {color}
                    </div>
                ))}
            </div>
        </div>
    );
};
