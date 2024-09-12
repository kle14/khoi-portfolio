import React, { useState } from 'react'
import { HudBar } from "./HudBar";
import Me from './../assets/IMG_6535.jpeg'
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
            <div className="pip-body">
                <div className="flex p-1 overflow-hidden flex-col absolute left-1 right-1 bottom-12 2xl:bottom-3 top-7 2xl:top-7">
                    <p className='w-full text-center h-fit mb-5'>
                        <ReactTyped
                            strings={[
                                "Welcome to my porfolio <br/> I am Khoi Le <br/> - Web Developer -"
                            ]}
                            typeSpeed={10}
                            className="text-center lg:text-base text-xl max-smh:text-base"
                            onComplete={handlComplete}
                        />
                    </p>
                    <div className='w-full h-full flex lg:flex-row flex-col max-lg:items-center gap-5'>
                        <div className='lg:w-1/2 max-lg:h-2/3 max-sm:h-1/2 max-lg:w-full flex justify-center items-center' >
                            {showGreeting && (
                                <img src={Me} alt="" className='lg:h-64 sm:h-80 h-72 max-smh:h-56 w-fit rounded-md' />
                            )}
                        </div>
                        <div className='lg:w-1/2 max-lg:h-1/3 max-sm:h-1/2 max-lg:w-full flex justify-center items-center'>
                            <div className='w-[90%] h-full flex flex-col items-start justify-center'>
                                {showGreeting && (
                                    <>
                                        <div className="w-full lg:w-fit h-fit flex justify-center lg:mb-5 underline-border">
                                            <ReactTyped
                                                strings={["Greetings, Visitors!"]}
                                                typeSpeed={10}
                                                className="lg:text-base text-xl max-smh:text-sm"
                                                onComplete={(self) => self.cursor.remove()}
                                            />
                                        </div>
                                        <div className="flex w-full lg:w-fit h-fit lg:items-start justify-center items-center flex-col lg:text-base text-lg max-smh:text-sm">
                                            <Options title="LinkedIn" link="https://www.linkedin.com/in/khoi--le/" />
                                            <Options title="GitHub" link="https://github.com/creekofbomb" />
                                            <DownloadOption title="My Resume" file={Resume} />
                                            <EmailOption title="Email Me" email="your.email@example.com" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Options = ({ title, link }) => {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="w-fit my-2 box-glow text-center p-1 cursor-pointer">
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

export default Home