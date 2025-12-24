"use client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ClassSelector({ flightClass, onClassChange }) {
  const { language } = useLanguage();

  const classOptions = [
    { value: "Y", label: language === "ar" ? "اقتصادية" : "Economy" },
    {
      value: "W",
      label: language === "ar" ? "اقتصادية ممتازة" : "Premium Economy",
    },
    {
      value: "C",
      label: language === "ar" ? "رجال أعمال" : "Business Class",
    },
    { value: "F", label: language === "ar" ? "درجة أولى" : "First Class" },
  ];

  return (
    <div className="flight-search__field flight-search__class">
      <label className="flight-search__label">
        {language === "ar" ? "الدرجة" : "CLASS"}
      </label>
      <div className="flight-search__input-wrapper">
        <i className="icon-chevron-down text-20"></i>
        <select
          className="flight-search__input flight-search__select"
          value={flightClass}
          onChange={(e) => onClassChange(e.target.value)}
        >
          {classOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
