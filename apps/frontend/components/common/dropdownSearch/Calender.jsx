"use client";

import { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export default function Calender({ dates, setDates }) {
  const [internalDates, setInternalDates] = useState([]);
  const [numberOfMonths, setNumberOfMonths] = useState(2);

  // Use parent dates if provided, otherwise use internal state
  const currentDates = dates !== undefined ? dates : internalDates;
  const handleChange = dates !== undefined ? setDates : setInternalDates;

  useEffect(() => {
    if (dates === undefined && internalDates.length === 0) {
      setInternalDates([
        new DateObject().setDay(5),
        new DateObject().setDay(14).add(1, "month"),
      ]);
    }
  }, [dates, internalDates.length]);

  // Handle responsive months
  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(window.innerWidth < 768 ? 1 : 2);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DatePicker
      inputClass="custom_input-picker"
      containerClassName="custom_container-picker"
      value={currentDates}
      onChange={handleChange}
      numberOfMonths={numberOfMonths}
      offsetY={10}
      range
      // className="yellow"
      rangeHover
      format="MMMM DD"
    />
  );
}
