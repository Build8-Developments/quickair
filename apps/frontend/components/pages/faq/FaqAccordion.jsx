"use client";

import { useState } from "react";

export default function FaqAccordion({ questions, isRTL }) {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (questionId) => {
    setActiveQuestion((prev) => (prev === questionId ? null : questionId));
  };

  return (
    <div className="faq-content">
      <div className="accordion -simple row y-gap-20 js-accordion">
        {questions.map((question) => (
          <div key={question.id} className="col-12">
            <div
              className={`accordion__item px-20 py-15 border-1 rounded-12 ${
                activeQuestion === question.id ? "is-active" : ""
              }`}
            >
              <div
                className="accordion__button d-flex items-center justify-between"
                onClick={() => toggleQuestion(question.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="button text-16 text-dark-1 fw-500">
                  {question.question}
                </div>

                <div className="accordion__icon size-30 flex-center bg-light-2 rounded-full">
                  <i className="icon-plus"></i>
                  <i className="icon-minus"></i>
                </div>
              </div>

              <div
                className="accordion__content"
                style={
                  activeQuestion === question.id
                    ? { maxHeight: "500px", overflow: "auto" }
                    : {}
                }
              >
                <div className="pt-20">
                  <p className="text-15 text-dark-2 lh-17">{question.answer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
