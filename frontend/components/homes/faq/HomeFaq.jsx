"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFaqData } from "@/data/faqData";
import Link from "next/link";
import FaqCategoryIcon from "@/components/common/FaqCategoryIcon";

export default function HomeFaq() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const categories = getFaqData(language);

  // Get first question from each category
  const featuredFaqs = categories.map((category) => ({
    categoryId: category.id,
    categoryName: category.name,
    categoryIcon: category.icon,
    question: category.questions[0],
  }));

  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (categoryId) => {
    setActiveQuestion((prev) => (prev === categoryId ? null : categoryId));
  };

  return (
    <section className="layout-pt-xl layout-pb-xl bg-light-1">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <h2 className="text-30 md:text-24 fw-600">
              {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            <p className="text-15 text-dark-2 mt-10">
              {isRTL
                ? "احصل على إجابات سريعة لأكثر الأسئلة شيوعًا"
                : "Get quick answers to the most common questions"}
            </p>
          </div>
        </div>

        <div className="row justify-center pt-40">
          <div className="col-xl-10 col-lg-11">
            <div className="accordion -simple row y-gap-20 js-accordion">
              {featuredFaqs.map((item) => (
                <div key={item.categoryId} className="col-12">
                  <div
                    className={`accordion__item px-20 py-15 border-1 rounded-12 bg-white ${
                      activeQuestion === item.categoryId ? "is-active" : ""
                    }`}
                  >
                    <div
                      className="accordion__button d-flex items-center justify-between"
                      onClick={() => toggleQuestion(item.categoryId)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className="d-flex items-center"
                        style={{ gap: "12px" }}
                      >
                        <div
                          className="size-40 flex-center rounded-full bg-accent-1-05"
                          style={{ flexShrink: 0 }}
                        >
                          <FaqCategoryIcon
                            iconKey={item.categoryIcon}
                            size={22}
                          />
                        </div>
                        <div className="button text-16 text-dark-1 fw-500">
                          {item.question.question}
                        </div>
                      </div>

                      <div
                        className="accordion__icon size-30 flex-center bg-light-2 rounded-full"
                        style={{ flexShrink: 0 }}
                      >
                        <i className="icon-plus"></i>
                        <i className="icon-minus"></i>
                      </div>
                    </div>

                    <div
                      className="accordion__content"
                      style={
                        activeQuestion === item.categoryId
                          ? { maxHeight: "500px" }
                          : {}
                      }
                    >
                      <div
                        className="pt-20 pl-50"
                        style={
                          isRTL
                            ? { paddingRight: "50px", paddingLeft: "0" }
                            : {}
                        }
                      >
                        <p className="text-15 text-dark-2 lh-17">
                          {item.question.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All FAQs Button */}
            <div className="row justify-center pt-40">
              <div className="col-auto">
                <Link
                  href="/faq"
                  className="button -md -dark-1 bg-accent-1 text-white px-40 py-15 rounded-12"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    flexDirection: isRTL ? "row-reverse" : "row",
                    gap: "10px",
                  }}
                >
                  {isRTL ? "عرض المزيد" : "View All FAQs"}
                  <i
                    className={isRTL ? "icon-arrow-left" : "icon-arrow-right"}
                  ></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
