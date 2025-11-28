"use client";

import PropTypes from "prop-types";

const strokeProps = {
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const ICON_BUILDERS = {
  "icon-plane": (color) => (
    <>
      <path
        d="M3.25 5.5l17.5 6.5-17.5 6.5 4.5-6.5z"
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
      <path
        d="M9 12l3 3.25.75-4.5"
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
    </>
  ),
  "icon-mosque": (color) => (
    <>
      <path
        d="M5 18v-4.5a7 7 0 0114 0V18"
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
      <path d="M3 18h18" stroke={color} strokeWidth={1.6} {...strokeProps} />
      <path
        d="M6 10V6l1.5-1.5"
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <path
        d="M18 10V6l-1.5-1.5"
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <path
        d="M12 7.25c.75 0 1.5-.5 1.5-1.25S12.75 4.75 12 4.75"
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
    </>
  ),
  "icon-bed": (color) => (
    <>
      <rect
        x={3.5}
        y={11}
        width={17}
        height={7.5}
        rx={1.5}
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
      <path
        d="M3.5 11V9.5A2.5 2.5 0 016 7h3a2.5 2.5 0 012.5 2.5V11"
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
    </>
  ),
  "icon-passport": (color) => (
    <>
      <rect
        x={5.25}
        y={4.75}
        width={13.5}
        height={14.5}
        rx={2}
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
      <circle
        cx={12}
        cy={11}
        r={3}
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <path
        d="M9.25 11H14.75M12 8v6"
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <path
        d="M8.75 16.5h6.5"
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
    </>
  ),
  "icon-help": (color) => (
    <>
      <circle
        cx={8}
        cy={10}
        r={2.3}
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <circle
        cx={16}
        cy={10}
        r={2.3}
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <path
        d="M3.5 18c.4-3 2.5-4.5 4.5-4.5h2"
        stroke={color}
        strokeWidth={1.5}
        {...strokeProps}
      />
      <path
        d="M20.5 18c-.4-3-2.5-4.5-4.5-4.5h-2"
        stroke={color}
        strokeWidth={1.5}
        {...strokeProps}
      />
      <path
        d="M9.5 15.5l1.75 1.75a2 2 0 002.75 0L15.75 15.5"
        stroke={color}
        strokeWidth={1.5}
        {...strokeProps}
      />
    </>
  ),
  "icon-bus": (color) => (
    <>
      <rect
        x={4}
        y={6.5}
        width={16}
        height={9.5}
        rx={2.5}
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
      <path
        d="M4 12h16"
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
      <circle
        cx={8}
        cy={17}
        r={1.5}
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <circle
        cx={16}
        cy={17}
        r={1.5}
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
    </>
  ),
  "icon-car": (color) => (
    <>
      <path
        d="M5 16.5H4a1.5 1.5 0 01-1.5-1.5v-1.5l1.5-4 3-2.5h8l3 2.5 1.5 4V15a1.5 1.5 0 01-1.5 1.5H19"
        stroke={color}
        strokeWidth={1.6}
        {...strokeProps}
      />
      <circle
        cx={7.5}
        cy={17.5}
        r={1.5}
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <circle
        cx={16.5}
        cy={17.5}
        r={1.5}
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
      <path
        d="M7 7.5h10"
        stroke={color}
        strokeWidth={1.4}
        {...strokeProps}
      />
    </>
  ),
};

const fallback = (color) => (
  <circle cx={12} cy={12} r={6} stroke={color} strokeWidth={1.6} {...strokeProps} />
);

export default function FaqCategoryIcon({ iconKey, size = 24, color = "var(--color-accent-1)" }) {
  const iconPaths = ICON_BUILDERS[iconKey] || fallback;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      {iconPaths(color)}
    </svg>
  );
}

FaqCategoryIcon.propTypes = {
  iconKey: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};
