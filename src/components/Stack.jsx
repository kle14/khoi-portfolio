import React, { useState, useEffect } from "react";

const groups = {
    PL: "Languages",
    Framework: "Frameworks",
    Databases: "Databases",
    Misc: "Misc"
};

const groupTagsMap = {
    PL: [
        { name: "Python", level: 5, frequency: 70 },
        { name: "C", level: 5, frequency: 100 },
        { name: "Java", level: 5, frequency: 30 },
        { name: "JavaScript", level: 4, frequency: 70 },
        { name: "HTML", level: 4, frequency: 90 },
        { name: "CSS", level: 4, frequency: 90 },
    ],
    Misc: [
        { name: "Git", level: 3, frequency: 80 },
        { name: "Docker", level: 3, frequency: 50 },
        { name: "REST", level: 4, frequency: 70 },
        { name: "Node.js", level: 3, frequency: 60 }
    ],
    Framework: [
        { name: "React", level: 4, frequency: 80 },
        { name: "TailwindCSS", level: 4, frequency: 70 },
        { name: "Express.js", level: 3, frequency: 40 },
        { name: "Django", level: 5, frequency: 70 },
        { name: "Flask", level: 3, frequency: 20 }
    ],
    Databases: [
        { name: "PostgreSQL", level: 3, frequency: 70 },
        { name: "MongoDB", level: 2, frequency: 40 },
    ],
};

const GroupTags = ({ activeGroup, activeTech, groupName, tags }) => {
    return (
        <div className="flex lg:flex-wrap">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className={`md:p-2 p-1 ${(activeGroup === groupName && !activeTech) || activeTech === tag.name
                        ? "text-primary"
                        : "text-secondary"
                        }`}
                >
                    {tag.name}
                </span>
            ))}
        </div>
    );
};

export const Stack = () => {
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeTech, setActiveTech] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenWidth = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkScreenWidth();
        window.addEventListener('resize', checkScreenWidth);

        return () => window.removeEventListener('resize', checkScreenWidth);
    }, []);

    const handleGroupInteraction = (group) => {
        setActiveGroup(group);
        setActiveTech(null);
    };

    const handleTechInteraction = (group, tech) => {
        setActiveGroup(group);
        setActiveTech(tech);
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            setActiveGroup(null);
            setActiveTech(null);
        }
    };

    const renderLevelIndicators = (level) => {
        return Array(5).fill(0).map((_, index) => (
            <div
                key={index}
                className={`h-3 w-3 border-style rounded-md mr-2 ${index < level ? 'bg-primary' : ''}`}
            ></div>
        ));
    };

    const renderGroupSection = (group) => (
        <div
            className='sm:w-[43%] h-full max-smh:mb-8'

        >
            <div className="sm:h-[10%] h-[5%] w-full"></div>
            <h1 className="w-full text-center box-glow" onMouseEnter={() => !isMobile && handleGroupInteraction(group)}
                onClick={() => isMobile && handleGroupInteraction(group)}
                onMouseLeave={handleMouseLeave}>{groups[group]}</h1>
            <div className='px-1 mt-2 text-xs sm:ml-3'>
                {groupTagsMap[group].map(item => (
                    <li
                        key={item.name}
                        className='flex flex-row items-center justify-between mb-1 box-glow'
                        onMouseEnter={() => !isMobile && handleTechInteraction(group, item.name)}
                        onClick={() => isMobile && handleTechInteraction(group, item.name)}
                    >
                        <div className='mr-5'>{item.name}</div>
                        <div className='flex flex-row'>
                            {renderLevelIndicators(item.level)}
                        </div>
                    </li>
                ))}
            </div>
        </div>
    );

    return (
        <div className='flex flex-col w-full h-full min-h-[300px] overflow-y-scroll sm:px-5'>
            <div className='w-full flex-grow flex sm:flex-row flex-col justify-between items-center'>
                {renderGroupSection('PL')}
                {renderGroupSection('Framework')}
            </div>
            <div className='w-full flex-grow flex sm:flex-row flex-col justify-between items-center'>
                {renderGroupSection('Databases')}
                {renderGroupSection('Misc')}
            </div>
            <div className="w-full h-auto flex justify-center">
                <div className="flex flex-wrap justify-center text-[9px]">
                    {Object.entries(groupTagsMap).map(([groupName, tags]) => (
                        <GroupTags
                            key={groupName}
                            activeGroup={activeGroup}
                            activeTech={activeTech}
                            groupName={groupName}
                            tags={tags}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};