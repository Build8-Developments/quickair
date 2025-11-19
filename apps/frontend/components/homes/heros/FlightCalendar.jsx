"use client";

import DatePicker, { DateObject } from "react-multi-date-picker";

export default function FlightCalendar({ date, setDate, minDate }) {
  const today = new DateObject();
  const minimumDate = minDate ? new DateObject(minDate) : today;

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
