import React, { useState, useEffect } from "react";

export const HudBar = ({ title }) => {
  const [time, setTime] = useState(new Date());
  const [age, setAge] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, []);

  useEffect(() => {
    const calculateAge = () => {
      const birthdate = new Date(2004, 0, 14); // January 14, 2004
      const today = new Date();
      let age = today.getFullYear() - birthdate.getFullYear();
      const month = today.getMonth() - birthdate.getMonth();

      if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
        age--;
      }

      setAge(age);
    };

    calculateAge();
  }, []);

  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const date = new Date();
      const currentYear = date.getFullYear();

      // Start date
      const startDate = new Date(currentYear, 0, 14);

      // Function to get the number of days in a year
      const numberOfDaysInYear = (year) =>
        (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

      // Get the total number of days in the current year
      const daysInYear = numberOfDaysInYear(currentYear);

      // Get the current day of the year since January 14
      const diff = date - startDate;
      const oneDay = 1000 * 60 * 60 * 24;
      const daysPassedSinceStartDate = Math.floor(diff / oneDay);

      // Calculate the percentage of the year that has passed since January 14
      const percentageOfDaysPassed =
        (daysPassedSinceStartDate / daysInYear) * 100;

      // Set the progress bar width as a percentage
      setProgressPercentage(percentageOfDaysPassed);
    };

    calculateProgress();
  }, []);

  const day = time.getDate();
  const month = time.getMonth() + 1;
  const year = time.getFullYear();
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div>
      <h3 className="pip-title">{title}</h3>
      <ul className="pip-head">
        <li>
          <b>Date:</b> {month}/{day}/{year}
        </li>
        <li>
          <b>Time:</b> {hours}:{minutes}:{seconds}
        </li>
        <li>
          <span className="fade-a">
            <b>Progress:</b> {progressPercentage.toFixed(2)}%
          </span>
          <span className="fade-b">
            <b>DR</b> 11
          </span>
        </li>
        <li>
          <b>Level</b> {age}
        </li>
      </ul>
    </div>
  );
};
