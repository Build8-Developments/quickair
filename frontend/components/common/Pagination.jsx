"use client";

import React, { useState, useEffect } from "react";

export default function Pagination({
  range = 20,
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Support both controlled and uncontrolled modes
  const [internalPage, setInternalPage] = useState(1);
  const isControlled = currentPage !== undefined && onPageChange !== undefined;
  const activePage = isControlled ? currentPage : internalPage;
  const totalPagesCount = totalPages || range;

  useEffect(() => {
    if (isControlled) {
      setInternalPage(currentPage);
    }
  }, [currentPage, isControlled]);

  const handlePageChange = (newPage) => {
    if (isControlled) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  return (
    <div className="pagination justify-center">
      <button
        onClick={() => handlePageChange(activePage > 1 ? activePage - 1 : 1)}
        className="pagination__button customStylePaginationPre button -accent-1 mr-15 -prev"
        disabled={activePage === 1}
      >
        <i className="icon-arrow-left text-15"></i>
      </button>

      <div className="pagination__count">
        <div
          style={{ cursor: "pointer" }}
          onClick={() => handlePageChange(1)}
          className={activePage == 1 ? `is-active` : ""}
        >
          1
        </div>
        {totalPagesCount > 1 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(2)}
            className={activePage == 2 ? `is-active` : ""}
          >
            2
          </div>
        )}
        {totalPagesCount > 2 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(3)}
            className={activePage == 3 ? `is-active` : ""}
          >
            3
          </div>
        )}
        {totalPagesCount > 3 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(4)}
            className={activePage == 4 ? `is-active` : ""}
          >
            4
          </div>
        )}

        {activePage == 5 && totalPagesCount != 5 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(5)}
            className={activePage == 5 ? `is-active` : ""}
          >
            5
          </div>
        )}

        {totalPagesCount > 5 && <div>...</div>}
        {activePage > 5 && activePage < totalPagesCount && (
          <div style={{ cursor: "pointer" }} className="is-active">
            {activePage}
          </div>
        )}
        {totalPagesCount > 4 && (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => handlePageChange(totalPagesCount)}
            className={activePage == totalPagesCount ? `is-active` : ""}
          >
            {totalPagesCount}
          </div>
        )}
      </div>

      <button
        onClick={() =>
          handlePageChange(
            activePage < totalPagesCount ? activePage + 1 : activePage
          )
        }
        className="pagination__button customStylePaginationNext button -accent-1 ml-15 -next"
        disabled={activePage === totalPagesCount}
      >
        <i className="icon-arrow-right text-15"></i>
      </button>
    </div>
  );
}
