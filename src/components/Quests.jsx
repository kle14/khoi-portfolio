import React, { useState } from "react";
import { HudBar } from "./HudBar";
import { Stack } from "./Stack";
import { Projects } from "./Projects";
import { Experiences } from "./Experiences";

export const Quests = () => {
  const [active, setActive] = useState(0);

  const handleActive = (index) => {
    setActive(index);
  };

  return (
    <div className="tab-pane fade h-full">
      <HudBar title="Quests" />
      <div className="pip-body">
        <div className="flex p-1 overflow-hidden lg:flex-row flex-col absolute left-1 right-1 bottom-12 lg:bottom-3 top-7">
          <div className="lg:w-[35%] w-full lg:h-full h-fit flex lg:justify-start justify-center px-2">
            <Options
              active={active}
              handleActive={handleActive}
            />
          </div>
          {active === 0 && <Stack />}
          {active === 1 && <Projects />}
          {active === 2 && <Experiences />}
        </div>
      </div>
    </div>
  );
};

const Options = ({ active, handleActive }) => {
  return (
    <ul className="lg:text-base text-sm flex lg:flex-col flex-row justify-between lg:justify-start w-full">
      {['Stack', 'Projects', 'Experiences'].map((item, index) => (
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
