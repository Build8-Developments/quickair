"use client";

import { useState, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

export default function FlightCalendar({ date, setDate, minDate }) {
  const [minimumDate, setMinimumDate] = useState(null);

  useEffect(() => {
    const today = new DateObject();
    setMinimumDate(minDate ? new DateObject(minDate) : today);
  }, [minDate]);

  if (!minimumDate) return null;

  return (
    <DatePicker
      inputClass="custom_input-picker"
      containerClassName="custom_container-picker"
      value={date}
      onChange={setDate}
      numberOfMonths={1}
      offsetY={10}
      format="MMM DD"
      minDate={minimumDate}
      placeholder="Select date"
    />
  );
}
