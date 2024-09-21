import React from "react";


export const Experiences = () => {
    const experiences = [
        {
            title: 'Leidos,Inc.',
            role: 'Web Developer Intern',
            duration: 'June 2024 - Present',
            summary: 'Collaborated in a team to develop a full-stack web application, featuring data visualization, geospatial mapping, and real-time updates data.',
            bulletpoints: [
                "Designed and implemented multiple features to increase usability and user experience while ensuring the quality, maintainability and scalability of the front end.",
                "Coordinated major refactors targeted towards app optimization and performance resulting in a smoother user experience and accomplished by eliminating redundant re-renders and API calls by over 50%.",
                "Developed and maintained the backend API to support the front end, ensuring the integrity of the data and the security of the application.",
            ],
        },
        {
            title: 'Center for History and New Media',
            role: 'IT Assistant',
            duration: 'February 2023 - June 2024',
            summary: 'Prototyped and maintained web applications for the Center, as well as, provided technical support for the staff.',
            bulletpoints: [
                "Prototyped a full-stack Django web application to inspect URL response from over 100 URLs for analysis and auditing purposes.",
                "Developed a CI/CD pipeline using Woodpecker to automate the deployment process, reducing the time to deploy by over 50%.",
                "Utilized Selenium to automate the process of auditing the Center's multiple websites, speeding up the process by over 60%.",
                "Provided technical support for the staff, including troubleshooting hardware and software issues, and maintaining the network infrastructure.",
            ]
        },
        {
            title: 'George Mason University',
            role: 'Teaching Assistant',
            duration: 'January 2023 - Present',
            summary: 'Grading assignments, holding office hours, creating projects, and assisting students in understanding course material.',
            bulletpoints: [
                "Graded over 250 assignments and provided feedback to students to help them understand the course material.",
                "Assisted in creating over 6 Java Object-Oriented-Programming projects to help students understand the course material.",
                "Helped and guided over 50 students in understanding the course material of over 3 different programming languages, including Java, C, and Python",
                "Held weekly office hours to help students with their assignments and projects.",
            ]
        },
    ];

    return (
        <div className="overflow-y-auto md:w-full h-full max-md:text-center lg:snap-y lg:snap-mandatory flex flex-col px-5">
            {experiences.map((experiences, index) => {
                return (
                    <div key={index} className="w-full h-full lg:snap-start flex-grow mb-20">
                        <div className="flex justify-center text-xl sm:mb-1">
                            {experiences.title}
                        </div>
                        <div className="h-fit">
                            <div className="max-sm:mb-4 mb-4 max-sm:mt-1 flex sm:justify-between max-sm:flex-col max-sm:items-center sm:items-center sm:pr-10">
                                <p className="text-base">{experiences.role}</p>
                                <p className="text-xs">{experiences.duration}</p>
                            </div>
                            <div>
                                <p className="sm:mb-3 mb-5 text-sm max-sm:text-center max-sm:text-xs sm:pr-10">{experiences.summary}</p>
                            </div>
                            <div className="h-full w-full">
                                {experiences.bulletpoints.map((point, pointIndex) => (
                                    <li key={pointIndex} className="mb-3 text-xs sm:pr-10">{point}</li>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )

}