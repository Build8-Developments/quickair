"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import styles from "./StepIndicator.module.css";

const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const buildIcon = (children) => <svg {...ICON_PROPS}>{children}</svg>;

const STEP_ICONS = {
  1: buildIcon(
    <>
      <path d="M6 4v16" />
      <path d="M6 4h10l-3 4 3 4H6" />
    </>
  ),
  2: buildIcon(
    <>
      <path d="M12 21s6-6.3 6-11a6 6 0 10-12 0c0 4.7 6 11 6 11z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  3: buildIcon(
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9.5l-2 5-5 2 2-5z" />
    </>
  ),
  4: buildIcon(
    <>
      <path d="M3 18V9a3 3 0 013-3h12a3 3 0 013 3v9" />
      <path d="M3 13h18" />
      <path d="M7.5 10.5h1.5" />
      <path d="M15 10.5h1.5" />
    </>
  ),
  5: buildIcon(
    <>
      <circle cx="9" cy="9" r="2.5" />
      <circle cx="15" cy="9" r="2.5" />
      <path d="M5 19v-1.2A3.8 3.8 0 018.8 14h2.4" />
      <path d="M19 19v-1.2a3.8 3.8 0 00-3.8-3.8h-2.4" />
    </>
  ),
  6: buildIcon(
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </>
  ),
  7: buildIcon(
    <>
      <rect x="3" y="7" width="18" height="12" rx="3" />
      <path d="M21 11h-4a2 2 0 000 4h4" />
      <path d="M17 7V5a2 2 0 00-2-2H6a3 3 0 00-3 3v4" />
    </>
  ),
  8: buildIcon(
    <>
      <rect x="7" y="4" width="10" height="16" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9v6" />
      <path d="M9 12h6" />
    </>
  ),
  9: buildIcon(
    <>
      <path d="M12 20s-6-4.3-6-9a4 4 0 017-2.2A4 4 0 0118 11c0 4.7-6 9-6 9z" />
    </>
  ),
  10: buildIcon(
    <>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M10 8h4" />
      <path d="M10 12h4" />
      <path d="M10 16h3" />
    </>
  ),
};

const CheckIcon = buildIcon(<path d="M6 12.5l3.5 3.5L18 8" />);
const DefaultIcon = buildIcon(<circle cx="12" cy="12" r="5" />);

const STEP_LABELS = {
  1: { ar: "الغرض", en: "Purpose" },
  2: { ar: "الموقع", en: "Location" },
  3: { ar: "الوجهة", en: "Destination" },
  4: { ar: "الفندق", en: "Hotel" },
  5: { ar: "المسافرون", en: "Travelers" },
  6: { ar: "التواريخ", en: "Dates" },
  7: { ar: "الميزانية", en: "Budget" },
  8: { ar: "التأشيرة", en: "Visa" },
  9: { ar: "التفضيلات", en: "Preferences" },
  10: { ar: "الملخص", en: "Summary" },
};

export default function StepIndicator({ steps, currentStep, onStepClick }) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.indicator}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isClickable = step.id <= currentStep;
          const title = STEP_LABELS[step.id]?.[language] || step.title;
          const iconNode = STEP_ICONS[step.id] || DefaultIcon;
          const itemClasses = [
            styles.item,
            isActive ? styles.itemActive : "",
            isCompleted ? styles.itemCompleted : "",
            isClickable ? styles.itemClickable : "",
          ]
            .filter(Boolean)
            .join(" ");
          const linePosition = isRTL
            ? { right: "50%", left: "auto" }
            : { left: "50%", right: "auto" };

          return (
            <div
              key={step.id}
              className={itemClasses}
              onClick={() => isClickable && onStepClick(step.id)}
              style={{ cursor: isClickable ? "pointer" : "default" }}
            >
              {/* Step Circle */}
              <div className={styles.circle}>
                {isCompleted ? CheckIcon : iconNode}
              </div>

              {/* Step Title */}
              <div className={styles.title}>{title}</div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={styles.line} style={linePosition}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
