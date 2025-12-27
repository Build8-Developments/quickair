"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import React from "react";
import { testimonialsThree } from "@/data/testimonials";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestimonialsThree() {
  const { language, t } = useLanguage();

  return (
    <section className="layout-pt-xl layout-pb-xl bg-light-3">
      <div className="container">
        <div className="row justify-center text-center">
          <div className="col-auto">
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
              {t("آراء عملائنا", "Customer Reviews")}
            </h2>
          </div>
        </div>

        <div className="row justify-center pt-60 md:pt-30">
          <div className="col-lg-10">
            <div data-aos="fade-up" data-aos-delay="">
              <Swiper
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                loop={true}
                modules={[Autoplay, Pagination]}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="testimonials-swiper"
              >
                {testimonialsThree.map((elm, i) => (
                  <SwiperSlide key={i}>
                    <div className="testimonial-card">
                      <div className="testimonial-card__quote">
                        <svg
                          width="32"
                          height="24"
                          viewBox="0 0 60 43"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.837 42.0652C11.0326 42.0652 7.6087 40.5435 4.56522 37.5C1.52174 34.3478 0 29.7283 0 23.6413C0 16.6848 1.84783 11.0326 5.54348 6.68478C9.34783 2.22825 14.7283 0 21.6848 0C24.1848 0 26.1413 0.163038 27.5543 0.489121V7.98912C26.0326 7.77173 24.0761 7.66304 21.6848 7.66304C17.9891 7.66304 15 8.91304 12.7174 11.413C10.5435 13.5869 9.29348 16.4674 8.96739 20.0543C10.3804 18.3152 12.663 17.4456 15.8152 17.4456C19.0761 17.4456 21.8478 18.587 24.1304 20.8696C26.413 23.0435 27.5543 25.9239 27.5543 29.5109C27.5543 33.2065 26.3587 36.25 23.9674 38.6413C21.5761 40.9239 18.5326 42.0652 14.837 42.0652ZM47.2826 42.0652C43.4783 42.0652 40.0543 40.5435 37.0109 37.5C33.9674 34.3478 32.4456 29.7283 32.4456 23.6413C32.4456 16.6848 34.2935 11.0326 37.9891 6.68478C41.7935 2.22825 47.1739 0 54.1304 0C56.6304 0 58.587 0.163038 60 0.489121V7.98912C58.4783 7.77173 56.5217 7.66304 54.1304 7.66304C50.4348 7.66304 47.4456 8.91304 45.163 11.413C42.9891 13.5869 41.7391 16.4674 41.413 20.0543C42.8261 18.3152 45.1087 17.4456 48.2609 17.4456C51.5217 17.4456 54.2935 18.587 56.5761 20.8696C58.8587 23.0435 60 25.9239 60 29.5109C60 33.2065 58.8043 36.25 56.413 38.6413C54.0217 40.9239 50.9783 42.0652 47.2826 42.0652Z"
                            fill="#0891B2"
                            opacity="0.2"
                          />
                        </svg>
                      </div>

                      <div className="testimonial-card__content">
                        <p className="testimonial-card__text">
                          {language === "ar" ? elm.comment.ar : elm.comment.en}
                        </p>
                      </div>

                      <div className="testimonial-card__footer">
                        <div className="testimonial-card__rating">
                          {[...Array(5)].map((_, starIndex) => (
                            <svg
                              key={starIndex}
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={
                                starIndex < elm.rating ? "#ffc107" : "#e0e0e0"
                              }
                              stroke="none"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>

                        <div className="testimonial-card__author">
                          <span className="testimonial-card__name">
                            {elm.name}
                          </span>
                        </div>

                        <div className="testimonial-card__meta">
                          {t("مراجعة", "reviews")} •{" "}
                          {language === "ar" ? elm.timeAgo.ar : elm.timeAgo.en}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .testimonials-swiper {
          padding-bottom: 50px !important;
        }

        .testimonials-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #0891b2;
          opacity: 0.3;
          transition: all 0.3s ease;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          transform: scale(1.2);
        }

        .testimonial-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          position: relative;
          min-height: 300px;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .testimonial-card__quote {
          text-align: center;
          margin-bottom: 10px;
        }

        .testimonial-card__content {
          flex: 1;
          margin-top: 10px;
          padding: 20px 10px;
          text-align: center;
        }

        .testimonial-card__text {
          font-size: 15px;
          line-height: 1.7;
          color: #4a5568;
          margin: 0;
        }

        .testimonial-card__footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
          text-align: center;
        }

        .testimonial-card__rating {
          display: flex;
          justify-content: center;
          gap: 2px;
          margin-bottom: 12px;
        }

        .testimonial-card__author {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .testimonial-card__name {
          font-weight: 600;
          font-size: 16px;
          color: #1a202c;
        }

        .testimonial-card__meta {
          font-size: 12px;
          color: #a0aec0;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .testimonial-card {
            padding: 24px;
            min-height: 260px;
          }

          .testimonial-card__text {
            font-size: 14px;
          }
        }
      `}</style>
    </section>
  );
}
