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
    <>
      {/* Desktop Sidebar */}
      <div className="faq-sidebar js-faq-sidebar d-none lg:d-block">
        <div className="faq-sidebar__title">
          <h3 className="text-20 fw-600">
            {isRTL ? "الفئات" : "Categories"}
          </h3>
        </div>
        <div className="faq-sidebar__list mt-30">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`faq-sidebar__item ${
                activeCategory === category.id ? "is-active" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <FaqCategoryIcon iconKey={category.icon} size={18} />
                <span>{category.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="faq-mobile-select d-block lg:d-none mb-30">
        <select
          value={activeCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="form-select"
          style={{
            width: "100%",
            padding: "12px 20px",
            fontSize: "15px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
