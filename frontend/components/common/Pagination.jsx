"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { buildPaginatedUrl } from "@/utils/pagination";

/**
 * Pagination component that supports both controlled mode and URL-based navigation
 *
 * Controlled mode: Pass currentPage and onPageChange props
 * URL mode: Pass baseUrl prop (and optionally preserveParams)
 *
 * @param {Object} props
 * @param {number} [props.range=20] - Legacy prop for total pages (deprecated, use totalPages)
 * @param {number} [props.currentPage] - Current active page (1-indexed)
 * @param {number} [props.totalPages] - Total number of pages
 * @param {Function} [props.onPageChange] - Callback when page changes (controlled mode)
 * @param {string} [props.baseUrl] - Base URL for URL-based navigation (URL mode)
 * @param {Record<string, string>} [props.preserveParams={}] - Query params to preserve in URL mode
 * @param {boolean} [props.isLoading=false] - Whether data is currently loading
 */
export default function Pagination({
  range = 20,
  currentPage,
  totalPages,
  onPageChange,
  baseUrl,
  preserveParams = {},
  isLoading = false,
}) {
  // Support both controlled and uncontrolled modes
  const [internalPage, setInternalPage] = useState(1);

  // Determine the mode: URL-based or controlled
  const isUrlMode = baseUrl !== undefined;
  const isControlled = currentPage !== undefined && onPageChange !== undefined;

  const activePage = isControlled || isUrlMode ? currentPage : internalPage;
  const totalPagesCount = totalPages || range;

  useEffect(() => {
    if (isControlled || isUrlMode) {
      setInternalPage(currentPage);
    }
  }, [currentPage, isControlled, isUrlMode]);

  const handlePageChange = (newPage) => {
    if (isControlled) {
      onPageChange(newPage);
    } else if (!isUrlMode) {
      setInternalPage(newPage);
    }
    // In URL mode, navigation is handled by Link component
  };

  // Don't render if only one page or no pages
  if (totalPagesCount <= 1) {
    return null;
  }

  // Helper to generate page URL for URL mode
  const getPageUrl = (page) => {
    if (isUrlMode) {
      return buildPaginatedUrl(baseUrl, page, preserveParams);
    }
    return "#";
  };

  // Render a page number element (Link in URL mode, div in controlled mode)
  const renderPageNumber = (pageNum) => {
    const isActive = activePage === pageNum;
    const className = isActive ? "is-active" : "";

    if (isUrlMode) {
      return (
        <Link
          key={pageNum}
          href={getPageUrl(pageNum)}
          className={className}
          style={{ cursor: isLoading ? "wait" : "pointer" }}
          aria-current={isActive ? "page" : undefined}
          aria-label={`Page ${pageNum}`}
        >
          {pageNum}
        </Link>
      );
    }

    return (
      <div
        key={pageNum}
        style={{ cursor: "pointer" }}
        onClick={() => handlePageChange(pageNum)}
        className={className}
      >
        {pageNum}
      </div>
    );
  };

  // Render previous button
  const renderPrevButton = () => {
    const isDisabled = activePage === 1 || isLoading;
    const prevPage = activePage > 1 ? activePage - 1 : 1;

    if (isUrlMode && !isDisabled) {
      return (
        <Link
          href={getPageUrl(prevPage)}
          className="pagination__button customStylePaginationPre button -accent-1 mr-15 -prev"
          aria-label="Previous page"
          style={{ cursor: isLoading ? "wait" : "pointer" }}
        >
          <i className="icon-arrow-left text-15"></i>
        </Link>
      );
    }

    return (
      <button
        onClick={() => handlePageChange(prevPage)}
        className="pagination__button customStylePaginationPre button -accent-1 mr-15 -prev"
        disabled={isDisabled}
        aria-label="Previous page"
      >
        <i className="icon-arrow-left text-15"></i>
      </button>
    );
  };

  // Render next button
  const renderNextButton = () => {
    const isDisabled = activePage === totalPagesCount || isLoading;
    const nextPage = activePage < totalPagesCount ? activePage + 1 : activePage;

    if (isUrlMode && !isDisabled) {
      return (
        <Link
          href={getPageUrl(nextPage)}
          className="pagination__button customStylePaginationNext button -accent-1 ml-15 -next"
          aria-label="Next page"
          style={{ cursor: isLoading ? "wait" : "pointer" }}
        >
          <i className="icon-arrow-right text-15"></i>
        </Link>
      );
    }

    return (
      <button
        onClick={() => handlePageChange(nextPage)}
        className="pagination__button customStylePaginationNext button -accent-1 ml-15 -next"
        disabled={isDisabled}
        aria-label="Next page"
      >
        <i className="icon-arrow-right text-15"></i>
      </button>
    );
  };

  return (
    <div
      className="pagination justify-center"
      role="navigation"
      aria-label="Pagination"
    >
      {renderPrevButton()}

      <div className="pagination__count">
        {/* Always show page 1 */}
        {renderPageNumber(1)}

        {/* Show page 2 if total pages > 1 */}
        {totalPagesCount > 1 && renderPageNumber(2)}

        {/* Show page 3 if total pages > 2 */}
        {totalPagesCount > 2 && renderPageNumber(3)}

        {/* Show page 4 if total pages > 3 */}
        {totalPagesCount > 3 && renderPageNumber(4)}

        {/* Show page 5 only when active and not the last page */}
        {activePage === 5 && totalPagesCount !== 5 && renderPageNumber(5)}

        {/* Show ellipsis if there are more than 5 pages */}
        {totalPagesCount > 5 && <div aria-hidden="true">...</div>}

        {/* Show current page if it's between 5 and last page */}
        {activePage > 5 &&
          activePage < totalPagesCount &&
          (isUrlMode ? (
            <Link
              href={getPageUrl(activePage)}
              className="is-active"
              style={{ cursor: isLoading ? "wait" : "pointer" }}
              aria-current="page"
              aria-label={`Page ${activePage}`}
            >
              {activePage}
            </Link>
          ) : (
            <div style={{ cursor: "pointer" }} className="is-active">
              {activePage}
            </div>
          ))}

        {/* Show last page if total pages > 4 */}
        {totalPagesCount > 4 && renderPageNumber(totalPagesCount)}
      </div>

      {renderNextButton()}
    </div>
  );
}
