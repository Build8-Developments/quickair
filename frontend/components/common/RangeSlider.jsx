"use client";
import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#EB662B", // Change this color to your desired primary color
    },
    secondary: {
      main: "#f50057", // Change this color to your desired secondary color
    },
  },
});

export default function RangeSlider({
  value: externalValue,
  onChange: externalOnChange,
  min = 0,
  max = 10000,
  step = 50,
}) {
  const [internalValue, setInternalValue] = useState([min, max]);

  // Support both controlled and uncontrolled modes
  const isControlled =
    externalValue !== undefined && externalOnChange !== undefined;
  const currentValue = isControlled ? externalValue : internalValue;

  useEffect(() => {
    if (isControlled) {
      setInternalValue(externalValue);
    }
  }, [externalValue, isControlled]);

  const handleChange = (event, newValue) => {
    if (isControlled) {
      externalOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <>
      <div className="js-price-rangeSlider" style={{ padding: "20px 15px" }}>
        <div className="px-5">
          <ThemeProvider theme={theme}>
            <Slider
              getAriaLabel={() => "Price range"}
              value={currentValue}
              onChange={handleChange}
              valueLabelDisplay="auto"
              max={max}
              min={min}
              step={step}
              disableSwap
            />
          </ThemeProvider>
        </div>

        <div className="d-flex justify-between mt-20">
          <div className="">
            <span className="">Price:</span>
            <span className="fw-500 js-lower"> ${currentValue[0]}</span>
            <span> - </span>
            <span className="fw-500 js-upper">${currentValue[1]}</span>
          </div>
        </div>
      </div>
    </>
  );
}
