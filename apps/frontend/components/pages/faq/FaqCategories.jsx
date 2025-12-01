"use client";

import { useTranslation } from "react-i18next";
import FaqCategoryIcon from "@/components/common/FaqCategoryIcon";

export default function FaqCategories({
  categories,
  activeCategory,
  onCategoryChange,
  isRTL,
}) {
  const { t } = useTranslation();

  return (
    <div className="faq-sidebar js-faq-sidebar">
      <div className="faq-sidebar__list">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`faq-sidebar__item ${
              activeCategory === category.id ? "is-active" : ""
            }`}
            style={{
              width: "100%",
              padding: "12px 0",
              textAlign: isRTL ? "right" : "left",
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "block",
              fontSize: "15px",
              fontWeight: activeCategory === category.id ? "500" : "400",
              color: activeCategory === category.id ? "#00A9A5" : "#1A2B48",
              borderLeft: activeCategory === category.id && !isRTL ? "3px solid #00A9A5" : "none",
              borderRight: activeCategory === category.id && isRTL ? "3px solid #00A9A5" : "none",
              paddingLeft: !isRTL ? "16px" : "0",
              paddingRight: isRTL ? "16px" : "0",
              transition: "all 0.3s ease",
            }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
