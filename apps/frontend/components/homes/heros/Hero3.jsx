"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocationSearch } from "@/lib/api/hooks/useLocation";

export default function Hero3() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Only search if query has at least 2 characters
  const shouldSearch = searchQuery.trim().length >= 2;

  // Use the custom hook for location search
  const { locations: searchResults, loading: isSearching } = useLocationSearch({
    query: shouldSearch ? searchQuery : "",
    locale: language,
    debounceMs: 300,
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setShowDropdown(false);
    // Navigate to location page
    router.push(`/location/${location.slug}`);
  };

  const dropDownContainer = useRef();
  useEffect(() => {
    const handleClick = (event) => {
      if (
        dropDownContainer.current &&
        !dropDownContainer.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <section className="hero -type-3">
      <div className="hero__bg" />

      <div className="container">
        <div className="row justify-between">
          <div className="col-xl-5 col-lg-5">
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="hero__subtitle mb-20 md:mb-10"
            >
              One site, 300,000+ experiences you'll remember
            </div>

            <h1 className="hero__title" data-aos="fade-up" data-aos-delay="300">
              Your Adventure
              <br className="md:d-none" />
              Travel Experts
              <br className="md:d-none" />
              In World!
              <Image
                width="214"
                height="23"
                src="/img/hero/3/brush.svg"
                alt="brush stroke"
              />
            </h1>

            <div
              data-aos="fade-up"
              data-aos-delay="300"
              className="hero__filter mt-60 lg:mt-30"
            >
              <div className="hero__search-wrapper" ref={dropDownContainer}>
                <div className="hero__search">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.0001 4.29932C7.95277 4.29932 6.28711 5.96498 6.28711 8.01232C6.28711 10.0597 7.95277 11.7253 10.0001 11.7253C12.0475 11.7253 13.7131 10.0597 13.7131 8.01232C13.7131 5.96498 12.0475 4.29932 10.0001 4.29932ZM10.0001 10.162C8.8148 10.162 7.85047 9.19764 7.85047 8.01232C7.85047 6.82701 8.8148 5.86268 10.0001 5.86268C11.1854 5.86268 12.1498 6.82701 12.1498 8.01232C12.1498 9.19764 11.1854 10.162 10.0001 10.162Z"
                      fill="#05073C"
                    />
                    <path
                      d="M10.0006 0C5.58258 0 1.98828 3.59434 1.98828 8.01231V8.23379C1.98828 10.4682 3.2693 13.0719 5.79586 15.9726C7.62742 18.0754 9.4334 19.5416 9.50934 19.603L10.0006 20L10.4918 19.6031C10.5678 19.5417 12.3738 18.0754 14.2053 15.9726C16.7318 13.0719 18.0129 10.4682 18.0129 8.23383V8.01234C18.0129 3.59434 14.4186 0 10.0006 0ZM16.4495 8.23383C16.4495 12.0098 11.5843 16.5807 10.0006 17.9683C8.41648 16.5803 3.55164 12.0095 3.55164 8.23383V8.01234C3.55164 4.45641 6.44465 1.5634 10.0006 1.5634C13.5565 1.5634 16.4495 4.45641 16.4495 8.01234V8.23383Z"
                      fill="#05073C"
                    />
                  </svg>

                  <input
                    type="text"
                    placeholder={
                      language === "ar"
                        ? "ابحث عن الوجهات"
                        : "Search destinations"
                    }
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                {/* Search Results Dropdown - Now outside the search bar */}
                {showDropdown && searchQuery.trim().length >= 2 && (
                  <div className="hero__search-dropdown">
                    {isSearching ? (
                      // Skeleton Loading State
                      <div className="hero__search-skeleton">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="hero__search-skeleton-item">
                            <div className="hero__search-skeleton-icon skeleton-pulse"></div>
                            <div className="hero__search-skeleton-info">
                              <div className="hero__search-skeleton-name skeleton-pulse"></div>
                              <div className="hero__search-skeleton-type skeleton-pulse"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      // Search Results
                      <div className="hero__search-results">
                        {searchResults.map((location) => (
                          <div
                            key={location.documentId}
                            className={`hero__search-item ${
                              location.featured ? "is-featured" : ""
                            }`}
                            onClick={() => handleLocationSelect(location)}
                          >
                            <div className="hero__search-icon">
                              <i className="icon-pin"></i>
                            </div>
                            <div className="hero__search-info">
                              <div className="hero__search-name">
                                {location.name}
                              </div>
                              <div className="hero__search-type">
                                {location.country || location.type}
                              </div>
                            </div>
                            {location.featured && (
                              <div className="hero__search-featured">
                                <i className="icon-star"></i>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // No Results Found
                      <div className="hero__search-empty">
                        <div className="hero__search-empty-icon">
                          <i className="icon-search"></i>
                        </div>
                        <div className="hero__search-empty-title">
                          {language === "ar"
                            ? "لم نجد نتائج"
                            : "No results found"}
                        </div>
                        <div className="hero__search-empty-text">
                          {language === "ar"
                            ? "جرب البحث بكلمات مختلفة أو تصفح وجهاتنا الشائعة"
                            : "Try different keywords or explore our trending destinations"}
                        </div>
                        <a
                          href="/#trending"
                          className="hero__search-empty-btn"
                          onClick={() => setShowDropdown(false)}
                        >
                          {language === "ar"
                            ? "تصفح الوجهات الشائعة"
                            : "Browse Trending Destinations"}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-xl-7 col-lg-7">
            <div className="hero__image">
              <div>
                <Image
                  width={340}
                  height={420}
                  src="/img/hero/3/1.png"
                  alt="image"
                />
                <Image
                  width={340}
                  height={250}
                  src="/img/hero/3/2.png"
                  alt="image"
                />
              </div>
              <Image
                width={340}
                height={620}
                src="/img/hero/3/3.png"
                alt="image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
