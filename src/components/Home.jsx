import React, { useState, useEffect } from "react";
import { HudBar } from "./HudBar";
import { ReactTyped } from "react-typed";
import Resume from './../assets/Resume.pdf'


const Home = () => {
  const [showGreeting, setShowGreeting] = useState(false);

  const handlComplete = (self) => {
    self.cursor.remove();
    setShowGreeting(true);
  };

  return (
    <div className="tab-pane fade h-full">
      <HudBar title="Home" />
      <div className="pip-body flex flex-col p-8">
        <div className="flex h-fit w-full justify-center items-center mb-5">
          <ReactTyped
            strings={[
              "Welcome to my porfolio <br/> I am Khoi Le <br/> - Web Developer -",
            ]}
            typeSpeed={10}
            className="text-center text-base"
            onComplete={handlComplete}
          />
        </div>
        {showGreeting && (
          <>
            <div className="w-full lg:w-fit h-fit flex justify-center mb-5 underline-border">
              <ReactTyped
                strings={["Greetings, Visitors!"]}
                typeSpeed={10}
                className="text-base"
                onComplete={(self) => self.cursor.remove()}
              />
            </div>
            <div className="flex w-full lg:w-fit h-fit lg:items-start justify-center items-center flex-col text-base">
              <Options title="LinkedIn" link="https://www.linkedin.com/in/khoi--le/" />
              <Options title="GitHub" link="https://github.com/kle14" />
              <DownloadOption title="My Resume" file={Resume} />
              <EmailOption title="Email Me" email="khoile1041@gmail.com" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Options = ({ title, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="w-fit my-3 box-glow text-center p-2 cursor-pointer">
      {"> " + title}
    </a>
  );
}

const DownloadOption = ({ title, file }) => {
  return (
    <a href={file} download className="w-fit my-2 box-glow text-center p-1 cursor-pointer">
      {"> " + title}
    </a>
  );
}

const EmailOption = ({ title, email }) => {
  return (
    <a href={`mailto:${email}`} className="w-fit my-2 box-glow text-center p-1 cursor-pointer">
      {"> " + title}
    </a>
  );
}

export default Home;
