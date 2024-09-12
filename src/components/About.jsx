import React, { useState, useEffect, useRef } from "react";
import { ReactTyped } from "react-typed";
import { HudBar } from "./HudBar";
const initialBotMessages = ["Hello! I'm Khoi Le, how can I help you today?"];

const messages = [
  {
    user: "Can you tell me a little bit about yourself?",
    bot: "I am currently a student at George Mason University studying Computer Science. I am currently working as an IT Assistant at the Roy Rosenzweig Center for History and New Media and teaching assistant both based at the university. I am passionate about software development and enjoy working on web and software projects. I am also a tech enthusiast and enjoy learning about new technologies.",
  },
  {
    user: "What are some fun facts about you?",
    bot: "I was the winner of a chess competition for the county when I was young.",
  },
  {
    user: "What are your future goals or aspirations?",
    bot: "I aspire to become a tech lead and work on innovative projects.",
  },
  {
    user: "Can you describe your role as an IT Assistant",
    bot: "As an IT Assistant, I provide technology support to the staff and faculty at the center. I also helped prototyping and developing web applications and pipelines mainly using Django, as well as, maintaining and updating the center's multiple websites using technologies such as OWASP, Uptime Kuma, and PostgreSQL.",
  },
  {
    user: "What is your favorite programming language?",
    bot: "I love working with Javascript. It is versatile and can be used for both front-end and back-end development and an easy language to learn. I also enjoy working with Python for its simplicity and readability.",
  },
  {
    user: "What is your favorite technology stack?",
    bot: "Currently, I enjoy working with the MERN stack though I have more experience working with Django.",
  },
  {
    user: "What specific web or software projects have you worked on?",
    bot: "I have worked on a variety of web and software projects, including a fitness web application, a chatbot, and a personal portfolio website and a link checker web application.",
  },
  {
    user: "What are your favorite projects?",
    bot: "My favorite project is the one you are currently viewing and Motion Matrix.",
  },
  {
    user: "What made you choose to study Computer Science?",
    bot: "I have always been interested in technology and computers. I enjoy problem-solving and creating things, so Computer Science was a natural choice for me. I also wanted to learn more about software development and programming languages.",
  },
  {
    user: "What programming languages are you proficient in?",
    bot: "I am proficient in Python, Javascript, Java, and C and had some contact with Assembly Language.",
  },
  {
    user: "What are some relevant courses you have taken?",
    bot: "I have taken courses in Data Structures and Algorithms, Full-Stack Web Development, Software Engineering, Low-Level Programming, and System Programming.",
  },
  {
    user: "How do you approach problem-solving in your projects?",
    bot: "I usually start by understanding the problem and breaking it down into smaller parts. I then research and brainstorm possible solutions and choose the best one. I also like to collaborate with others and get feedback on my ideas.",
  },
];

export const About = () => {
  const [indexa, setIndexa] = useState(0);
  const [indexb, setIndexb] = useState(1);
  const [indexc, setIndexc] = useState(2);
  const [messagesList, setMessagesList] = useState([
    { type: "bot", text: initialBotMessages[0] },
  ]);
  const chatContainerRef = useRef(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUserMessageClick = (index) => {
    const userMessage = messages[index].user;
    const botMessage = messages[index].bot;

    setMessagesList((prevMessages) => [
      ...prevMessages,
      { type: "user", text: userMessage },
      { type: "bot", text: botMessage },
    ]);

    let current = index;
    while (current !== 0 && current !== 1 && current !== 2) {
      current -= 3;
    }

    let nextIndex = index + 3;

    if (nextIndex >= messages.length) {
      if (current === 0) {
        nextIndex = 0;
      } else if (current === 1) {
        nextIndex = 1;
      } else if (current === 2) {
        nextIndex = 2;
      }
    }

    if (current === 0) {
      setIndexa(nextIndex);
    } else if (current === 1) {
      setIndexb(nextIndex);
    } else if (current === 2) {
      setIndexc(nextIndex);
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    });

    if (chatContainerRef.current) {
      observer.observe(chatContainerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (isSmallScreen) {
    return (
      <div className="tab-pane fade h-full">
        <HudBar title="About" />
        <div className="pip-body">
          <div className="chat-container flex p-1 border-style overflow-hidden flex-col absolute left-1 right-1 h-[90%] top-6">
            <div
              className="chat flex w-full h-[60%] border-style overflow-y-scroll mb-1 flex-col p-4"
              ref={chatContainerRef}
            >
              {messagesList.map((msg, index) =>
                msg.type === "user" ? (
                  <UserMessageDisplay key={index} text={msg.text} />
                ) : (
                  <BotMessage key={index} text={msg.text} />
                )
              )}
            </div>

            <div className="flex w-full h-[40%] border-style flex-col overflow-y-scroll">
              <UserMessage
                text={messages[indexa].user}
                onClick={() => {
                  handleUserMessageClick(indexa);
                }}
              />
              <UserMessage
                text={messages[indexb].user}
                onClick={() => {
                  handleUserMessageClick(indexb);
                }}
              />
              <UserMessage
                text={messages[indexc].user}
                onClick={() => {
                  handleUserMessageClick(indexc);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="tab-pane fade h-full">
      <HudBar title="About" />
      <div className="pip-body">
        <div className="flex p-1 overflow-hidden flex-col absolute left-1 right-1 h-[90%] top-6 text-xs">
          <div
            className="flex w-full h-[75%] overflow-y-scroll mb-1 flex-col"
            ref={chatContainerRef}
          >
            {messagesList.map((msg, index) =>
              msg.type === "user" ? (
                <UserMessageDisplay key={index} text={msg.text} />
              ) : (
                <BotMessage key={index} text={msg.text} />
              )
            )}
          </div>

          <div className="flex w-full h-[25%] border-style flex-col justify-center p-2">
            <UserMessage
              text={messages[indexa].user}
              onClick={() => {
                handleUserMessageClick(indexa);
              }}
            />
            <UserMessage
              text={messages[indexb].user}
              onClick={() => {
                handleUserMessageClick(indexb);
              }}
            />
            <UserMessage
              text={messages[indexc].user}
              onClick={() => {
                handleUserMessageClick(indexc);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserMessage = ({ text, onClick }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallScreen) {
    return (
      <div
        onClick={onClick}
        className="flex w-fit h-fit p-2 justify-start border-style m-3 cursor-pointer text-style box-glow transition duration-400 ease-in-out"
      >
        {text}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="flex lg:w-full w-fit h-fit lg:p-1 p-2 justify-start max-lgw:border-style max-lgw:m-3 cursor-pointer text-style box-glow transition duration-400 ease-in-out"
    >
      {"> " + text}
    </div>
  );
};

const BotMessage = ({ text }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallScreen) {
    const concatenatedText = "> " + text;
    return (
      <div className="flex justify-start w-full my-3">
        <div className="flex- w-fit text-style border-style md:max-w-[50%] p-2">
          <ReactTyped
            strings={[concatenatedText]}
            typeSpeed={10}
            className="text-style"
            onComplete={(self) => self.cursor.remove()}
          />
        </div>
      </div>
    );
  } else {
    const concatenatedText = "> Khoi: " + text;
    return (
      <div className="flex justify-start w-full my-1">
        <div className="flex- w-fit text-style p-2">
          <ReactTyped
            strings={[concatenatedText]}
            typeSpeed={10}
            className="text-style"
            onComplete={(self) => self.cursor.remove()}
          />
        </div>
      </div>
    );
  }
};

const UserMessageDisplay = ({ text }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSmallScreen) {
    return (
      <div className="flex justify-end w-full my-3">
        <div className="flex w-fit text-style border-style md:max-w-[50%] p-2">
          {text}
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-start w-full my-1">
        <div className="flex w-fit text-style p-2">
          {'> Visitor: ' + text}
        </div>
      </div>
    );
  }
};

export default About;
