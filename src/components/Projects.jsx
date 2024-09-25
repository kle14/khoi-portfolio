import React from 'react';
import placeholderImage from '../assets/placeholder.webp';
import MotionMatrix from '../assets/motionMatrix.gif';
import minesweeper from '../assets/minesweeper.gif';
import Kruskal from '../assets/Kruskal_Algo.gif';
import Porfolio from '../assets/portfolioWebsite.png';


export const Projects = () => {
    const projects = [
        {
            title: 'Portfolio Website',
            description: `
            I built this portfolio website over the summer as a personal project. It was a challenging fill with fun experience
            . Inspired by the Fallout series and retro design, 
            `,
            techStack: ['React', 'TailwindCSS', 'HTML/CSS', 'JavaScript'],
            github: 'https://github.com/kle14/khoi-portfolio',
            media: Porfolio,
        },
        {
            title: 'Motion Matrix',
            description: `
            As part of my Web Development course, 
            I worked in a team of 4 to develop a full-stack fitness web application that allows users to create their workouts and track progress. 
            
            `,
            techStack: ['Python', 'Django', 'Sqlite', 'HTML/CSS', 'JavaScript'],
            github: 'https://github.com/kcsheraj/Motion-Matrix',
            media: MotionMatrix,
        },
        // {
        //     title: '------ AI Chatbot -------',
        //     description: `
        //     This is a chatbot interface that I have built as part of my self-learning project. 
        //     Using the available model on Hugging Face, I was able to create a chatbot interface. 
        //     Despite not completed , I'm planning on continue working on this project and adding more features to it.
        //     `,
        //     techStack: ['Python', 'Django', 'HTML/CSS', 'JavaScript'],
        //     github: 'https://github.com/kle14/AI_project',
        //     media: placeholderImage,
        // },
        // {
        //     title: 'Buffer Management System',
        //     description: `
        //     Developed in C, this project involved creating a buffer management system, featuring buffer creation, modification, 
        //     file input/output operations, and running user-specified programs.
        //     `,
        //     techStack: ['C', 'GDB', 'Makefile'],
        //     github: 'https://github.com/kle14/NARU_Buffer_Management_System',
        //     media: placeholderImage,
        // },
        {
            title: 'Kruskal Algorithm Visualizer',
            description: `
            This is a visualizer for the Kruskal Algorithm. 
            Utilizing Java and JavaFX, I was able to create a simple yet effective visualizer that
            shows how the Kruskal Algorithm works.
            `,
            techStack: ['Java', 'JavaFX'],
            github: 'https://github.com/kle14/Kruskal_Algorithm_Simulator',
            media: Kruskal,
        },
        {
            title: 'Minesweeper Game',
            description: `
            This is a simple Minesweeper game that I made as part of my Data Structure & Algorithm course. 
            It features a simple GUI and the ability to play the game with varying difficulties.
            `,
            techStack: ['Java', 'JavaFX'],
            github: 'https://github.com/kle14/Minesweeper',
            media: minesweeper,
        },
    ];


    return (
        <div className='overflow-y-auto md:w-full h-full max-md:text-center lg:snap-y lg:snap-mandatory flex flex-col px-5'>
            {projects.map((project, index) => {
                return (
                    <div key={index} className='w-full h-full lg:snap-start mb-8 flex-grow'>
                        <div className='flex justify-center lg:text-xl text-lg mb-2'>
                            {project.title}
                        </div>
                        <div className='px-3 mb-2 text-xs flex justify-center flex-wrap'>
                            {project.techStack.map((tech, index) => {
                                return (
                                    <div key={index} className='mr-2 box-glow'>{tech}</div>
                                )
                            })}
                        </div>
                        <div className='h-full flex flex-col items-center flex-grow'>
                            <img src={project.media} alt={placeholderImage} className="lg:w-[75%] w-[95%] lg:h-52 sm:h-[80%] mb-2" />
                            <a href={project.github} className='text-xs mb-1 box-glow'>Check me out</a>
                            <p className='lg:text-xs sm:text-sm text-base max-smh:text-xs px-7 text-center'>{project.description}</p>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}