"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import FaqCategories from "./FaqCategories";
import FaqAccordion from "./FaqAccordion";
import { getFaqData } from "@/data/faqData";
import FaqCategoryIcon from "@/components/common/FaqCategoryIcon";

export default function FaqContent() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const categories = getFaqData(language);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [currentCategory, setCurrentCategory] = useState(categories[0]);

  useEffect(() => {
    // Update categories when language changes
    const updatedCategories = getFaqData(language);
    setActiveCategory(updatedCategories[0]?.id);
    setCurrentCategory(updatedCategories[0]);
  }, [language]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    const category = categories.find((cat) => cat.id === categoryId);
    setCurrentCategory(category);
  };

  return (
    <section className="layout-pt-md layout-pb-lg">
      <div className="container">
        <div className="row y-gap-30">
          {/* Left Sidebar - Categories */}
          <div className="col-lg-3">
            <FaqCategories
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              isRTL={isRTL}
            />
          </div>

          {/* Right Content - Questions & Answers */}
          <div className="col-lg-9">
            <div className="faq-category-header mb-40">
              <div className="d-flex items-center">
                <div className="size-50 flex-center rounded-full bg-accent-1-05 mr-15">
                  <FaqCategoryIcon iconKey={currentCategory?.icon} size={28} />
                </div>
                <div>
                  <h2 className="text-24 fw-600">{currentCategory?.name}</h2>
                  <p className="text-14 text-light-2 mt-5">
                    {isRTL
                      ? `${currentCategory?.questions.length} سؤال`
                      : `${currentCategory?.questions.length} Questions`}
                  </p>
                </div>
              </div>
            </div>

            {currentCategory && (
              <FaqAccordion
                questions={currentCategory.questions}
                isRTL={isRTL}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
