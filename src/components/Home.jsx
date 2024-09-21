import React, { useState, useEffect } from 'react'
import { HudBar } from "./HudBar";
import { ReactTyped } from "react-typed";
import Resume from './../assets/Resume.pdf'

const TypedAsciiArt = ({ arts, onComplete }) => {
    const [typedArt, setTypedArt] = useState('');
    const [currentArtIndex, setCurrentArtIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const currentArt = arts[currentArtIndex];
        if (isTyping) {
            if (index < currentArt.length) {
                const timer = setTimeout(() => {
                    setTypedArt(prev => prev + currentArt[index]);
                    setIndex(index + 1);
                }, 1);
                return () => clearTimeout(timer);
            } else {
                setIsPaused(true);
                const pauseTimer = setTimeout(() => {
                    setIsPaused(false);
                    setIsTyping(false);
                    setIndex(currentArt.length - 1);
                }, 3000);
                return () => clearTimeout(pauseTimer);
            }
        } else if (!isPaused) {
            if (index >= 0) {
                const timer = setTimeout(() => {
                    setTypedArt(prev => prev.slice(0, -1));
                    setIndex(index - 1);
                }, 1);
                return () => clearTimeout(timer);
            } else {
                setIsTyping(true);
                setIndex(0);
                setCurrentArtIndex((prevIndex) => (prevIndex + 1) % arts.length);
                if (onComplete) onComplete();
            }
        }
    }, [arts, currentArtIndex, index, isTyping, isPaused, onComplete]);

    return (
        <pre className="lg:text-xs text-[8px] whitespace-pre">
            {typedArt}
        </pre>
    );
};

export const Home = () => {
    const [showGreeting, setShowGreeting] = useState(false);
    const [showAsciiArt, setShowAsciiArt] = useState(false);

    const handleComplete = (self) => {
        self.cursor.remove();
        setShowGreeting(true);
        setShowAsciiArt(true);
    };

    const asciiArts = [
        `
  |* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
  | * * * * * * * * *  :::::::::::::::::::::::::|
  |* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
  | * * * * * * * * *  :::::::::::::::::::::::::|
  |* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
  | * * * * * * * * *  ::::::::::::::::::::;::::|
  |* * * * * * * * * * OOOOOOOOOOOOOOOOOOOOOOOOO|
  |:::::::::::::::::::::::::::::::::::::::::::::|
  |OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO|
  |:::::::::::::::::::::::::::::::::::::::::::::|
  |OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO|
  |:::::::::::::::::::::::::::::::::::::::::::::|
  |OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO|`,

        `
           W            __  __
          [ ]          |::||::|
           3   ._.     |::||::|   ._.
          /|   |:| ._. |::||::|   |/|
      \\|// /   |:|_|/| |::||::|_  |/|
     -( )-|    |:|"|/|_|::||::|\\|_|/| _
      J V |    |:|"|/|||::||::|\\|||/||:|
___  '    /  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
\\  \\/    |        ~~~ ~~~ ~~~~~ ~~~~~
       `,

        `
        (\`.
         ) )
        ( (
         \\ \\
          \\ \\
        .-'  \`-.
       /        \`.
      (      )    \`-._ ,    _
       )   ,'         (.\`--'(
       \\  (         ) /      \\
        \\  \\_(     / (    <6 (6
         \\_)))\\   (   \`._  .:Y)__
          '''  \\   \`-._.'----^_)))
                \`-._ )))       \`\`\`
                     \`\`\`
    `,
        `
                 _ _.-'\`-._ _
                ;.'________'.;
     _________n.[____________].n_________
   |""_""_""_""||==||==||==||""_""_""_""|
   |"""""""""""||..||..||..||"""""""""""|
   |LI LI LI LI||LI||LI||LI||LI LI LI LI|
   |..  ..  .. ||..||..||..||..  ..  .. |
   |LI LI LI LI||LI||LI||LI||LI LI LI LI|
,,;;,;;;,;;;,;;;,;;;,;;;,;;;,;;,;;;,;;;,;;,,
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
`,
        `
            /)-_-(\        /)-_-(\\
             (o o)          (o o)
     .-----__/\\o/            \\o/\\__-----.
    /  __      /              \\      __  \\
\\__/\\ /  \\_\\ |/                \\| /_/  \\ /\\__/
     \\\\     ||                  ||      \\\\
     //     ||                  ||      //
     |\\     |\\                  /|     /|
    `,
        `
         __________
       .'----------'.
       | .--------. |
       | |########| |       __________
       | |########| |      /__________\\
.------| '--------' |------|    --=-- |-------------.
|      '----,-.-----'      |o ======  |             |
|     ______|_|_______     |__________|             |
|    /  %%%%%%%%%%%%  \\                             |
|   /  %%%%%%%%%%%%%%  \\                            |
|   ^^^^^^^^^^^^^^^^^^^^                            |
+-----------------------------------------------------+
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    `,
        `
           ,.,
      MMMM_    ,..,
        "_ "__"MMMMM          ,...,,
 ,..., __." --"    ,.,     _-"MMMMMMM
MMMMMM"___ "_._   MMM"_."" _ """"""
 """""    "" , \\_.   "_. ."
        ,., _"__ \\__./ ."
       MMMMM_"  "_    ./
        ''''      (    )
 ._______________.-'____"---._.
  \\                          /
   \\________________________/
   (_)                    (_)
    `,
        `
                                                       .::.
                                            _()_       _::_
                                  _O      _/____\\_   _/____\\_
           _  _  _     ^^__      / //\\    \\      /   \\      /
          | || || |   /  - \\_   {     }    \\____/     \\____/
          |_______| <|    __<    \\___/     (____)     (____)
    _     \\__ ___ / <|    \\      (___)      |  |       |  |
   (_)     |___|_|  <|     \\      |_|       |__|       |__|
  (___)    |_|___|  <|______\\    /   \\     /    \\     /    \\
  _|_|_    |___|_|   _|____|_   (_____)   (______)   (______)
 (_____)  (_______) (________) (_______) (________) (________)
 /_____\\  /_______\\ /________\\ /_______\\ /________\\ /________\\
    `


    ];

    return (
        <div className="tab-pane fade h-full">
            <HudBar title="Home" />
            <div className="pip-body">
                <div className="flex p-1 overflow-hidden flex-col absolute left-1 right-1 bottom-3 top-7 max-sm:pb-16">
                    <p className='w-full text-center h-fit mb-5'>
                        <ReactTyped
                            strings={[
                                "Welcome to my porfolio <br/> I am Khoi Le <br/> - Web Developer -"
                            ]}
                            typeSpeed={10}
                            className="text-center lg:text-base text-xl max-smh:text-base"
                            onComplete={handleComplete}
                        />
                    </p>
                    <div className='w-full h-full flex lg:flex-row flex-col max-lg:items-center gap-5 px-3'>
                        <div className='lg:w-1/3 max-lg:h-1/3 max-sm:h-1/2 max-lg:w-full flex justify-center items-center'>
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
                                            <Options title="GitHub" link="https://github.com/kle14" />
                                            <DownloadOption title="My Resume" file={Resume} />
                                            <EmailOption title="Email Me" email="khoile1041@gmail.com" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='lg:w-2/3 max-lg:h-2/3 max-sm:h-1/2 max-lg:w-full flex justify-center items-center' >
                            {showAsciiArt && (
                                <TypedAsciiArt
                                    arts={asciiArts}
                                    onComplete={() => console.log('Cycle complete')}
                                />
                            )}
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
        <a href={`mailto:${email} `} className="w-fit my-2 box-glow text-center p-1 cursor-pointer">
            {"> " + title}
        </a>
    );
}
