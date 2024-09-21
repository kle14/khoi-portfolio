import React, { useState } from "react";

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
    Misc: [
        { name: "Git", level: 4, frequency: 80 },
        { name: "Docker", level: 3, frequency: 50 },
        { name: "REST", level: 4, frequency: 70 },
        // { name: "Node.js", level: 3, frequency: 60 },
        { name: "Selenium", level: 3, frequency: 30 },
        { name: "Chart.js", level: 3, frequency: 40 },
        { name: "JavaFX", level: 3, frequency: 30 },
    ],
};

const GroupTags = ({ activeGroup, activeTech, groupName, tags }) => {
    return (
        <div className="flex flex-wrap mt-2">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className={`text-xs md:text-sm p-1 md:p-2 m-1 ${(activeGroup === groupName && !activeTech) || activeTech === tag.name
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

const AccordionItem = ({ group, tags, isOpen, toggleAccordion, activeGroup, activeTech, handleTechInteraction }) => {
    const renderLevelIndicators = (level) => {
        return Array(5).fill(0).map((_, index) => (
            <div
                key={index}
                className={`h-2 w-2 md:h-3 md:w-3 border-style rounded-full mr-1 md:mr-2 ${index < level ? 'bg-current' : 'bg-transparent'
                    }`}
            ></div>
        ));
    };

    return (
        <div className="mb-4 border-style rounded">
            <button
                className="w-full p-4 text-left flex justify-between items-center box-glow"
                onClick={toggleAccordion}
            >
                <span className="font-semibold">{groups[group]}</span>
                <span className="text-xl">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div className="p-4 border-style">
                    <ul className="space-y-1">
                        {tags.map(item => (
                            <li
                                key={item.name}
                                className="flex flex-row items-center justify-between text-sm md:text-base p-1 box-glow cursor-pointer"
                                onMouseEnter={() => handleTechInteraction(group, item.name)}
                            >
                                <div className="mr-5">{item.name}</div>
                                <div className="flex flex-row">
                                    {renderLevelIndicators(item.level)}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <GroupTags
                        activeGroup={activeGroup}
                        activeTech={activeTech}
                        groupName={group}
                        tags={tags}
                    />
                </div>
            )}
        </div>
    );
};

export const Stack = () => {
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeTech, setActiveTech] = useState(null);
    const [openAccordions, setOpenAccordions] = useState({});

    const handleTechInteraction = (group, tech) => {
        setActiveGroup(group);
        setActiveTech(tech);
    };

    const toggleAccordion = (group) => {
        setOpenAccordions(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
        setActiveGroup(group);
        setActiveTech(null);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 h-full overflow-y-auto">
            {Object.entries(groupTagsMap).map(([group, tags]) => (
                <AccordionItem
                    key={group}
                    group={group}
                    tags={tags}
                    isOpen={openAccordions[group]}
                    toggleAccordion={() => toggleAccordion(group)}
                    activeGroup={activeGroup}
                    activeTech={activeTech}
                    handleTechInteraction={handleTechInteraction}
                />
            ))}
        </div>
    );
};