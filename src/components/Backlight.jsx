import React, { useState, useEffect, useCallback, useMemo } from 'react';

export const Backlight = () => {
    const colors = useMemo(() => ['Amber', 'Red', 'Green', 'Blue', 'Yellow', 'White'], []);

    const colorValues = useMemo(() => ({
        amber: { main: '255, 170, 60', alt: '128, 75, 20' },
        red: { main: '255, 0, 0', alt: '128, 0, 0' },
        green: { main: '0, 255, 0', alt: '0, 128, 0' },
        blue: { main: '50, 150, 255', alt: '20, 80, 160' },
        yellow: { main: '255, 255, 0', alt: '128, 128, 0' },
        white: { main: '255, 255, 255', alt: '128, 128, 128' }
    }), []);

    const getColorValues = useCallback((color) => colorValues[color.toLowerCase()], [colorValues]);

    const getInitialIndex = useCallback(() => {
        const currentColor = document.documentElement.style.getPropertyValue('--main').trim();
        const colorToIndex = Object.keys(colorValues).findIndex(color => colorValues[color].main === currentColor);
        return colorToIndex !== -1 ? colorToIndex : 0;
    }, [colorValues]);

    const [active, setActive] = useState(() => getInitialIndex());

    const changeRootColor = useCallback((color) => {
        const root = document.documentElement;
        const lowerCaseColor = color.toLowerCase();
        const { main, alt } = getColorValues(lowerCaseColor);
        root.style.setProperty('--main', main);
        root.style.setProperty('--alt', alt);
        root.className = lowerCaseColor; // Set the class name for the root element
    }, [getColorValues]);

    const handleActive = useCallback((index, color) => {
        setActive(index);
        changeRootColor(color);
    }, [changeRootColor]);

    useEffect(() => {
        setActive(getInitialIndex());
        const initialColor = colors[getInitialIndex()];
        changeRootColor(initialColor);
    }, [getInitialIndex, colors, changeRootColor]);

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