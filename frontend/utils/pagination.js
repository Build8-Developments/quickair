/**
 * Pagination utility functions for server-side pagination
 * @module utils/pagination
 */

/**
 * Validates and normalizes a page parameter to a valid page number
 * - Non-numeric values default to page 1
 * - Negative numbers and zero default to page 1
 * - Values exceeding totalPages are clamped to totalPages
 *
 * @param {string|number} pageParam - The page parameter from URL or user input
 * @param {number} totalPages - The total number of pages available
 * @returns {number} A valid page number within the range [1, totalPages]
 *
 * Requirements: 1.3, 1.4
 */
export function validatePage(pageParam, totalPages) {
  const page = parseInt(pageParam, 10);

  // Handle non-numeric, negative, or zero values
  if (isNaN(page) || page < 1) {
    return 1;
  }

  // Clamp to last page if exceeds total (only if totalPages > 0)
  if (page > totalPages && totalPages > 0) {
    return totalPages;
  }

  return page;
}

/**
 * Calculates the start and end indices for displaying pagination range
 * Used for "Showing X-Y of Z results" display
 *
 * @param {number} page - Current page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @param {number} total - Total number of items
 * @returns {{ start: number, end: number, total: number }} The range indices
 *
 * Requirements: 3.5
 */
export function calculatePaginationRange(page, pageSize, total) {
  // Handle empty dataset
  if (total === 0) {
    return { start: 0, end: 0, total: 0 };
  }

  // Calculate start index (1-indexed for display)
  const start = (page - 1) * pageSize + 1;

  // Calculate end index, capped at total
  const end = Math.min(page * pageSize, total);

  return { start, end, total };
}

/**
 * Builds a paginated URL with the page parameter
 * Preserves existing query parameters while updating/adding the page param
 *
 * @param {string} baseUrl - The base URL path (e.g., "/en/hotels")
 * @param {number} page - The page number to set
 * @param {Record<string, string>} [preserveParams={}] - Additional query params to preserve
 * @returns {string} The complete URL with page parameter
 *
 * Requirements: 1.3, 1.4
 */
export function buildPaginatedUrl(baseUrl, page, preserveParams = {}) {
  // Create URLSearchParams from preserved params
  const params = new URLSearchParams();

  // Add preserved parameters first
  Object.entries(preserveParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  // Add page parameter (only if not page 1 to keep URLs clean)
  if (page > 1) {
    params.set("page", String(page));
  } else {
    // Remove page param if it exists and we're on page 1
    params.delete("page");
  }

  // Build the final URL
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Calculates the total number of pages
 *
 * @param {number} total - Total number of items
 * @param {number} pageSize - Number of items per page
 * @returns {number} Total number of pages
 */
export function calculateTotalPages(total, pageSize) {
  if (total <= 0 || pageSize <= 0) {
    return 0;
  }
  return Math.ceil(total / pageSize);
}

/**
 * Calculates the GraphQL pagination offset
 *
 * @param {number} page - Current page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {number} The start offset for GraphQL pagination
 */
export function calculateOffset(page, pageSize) {
  return (page - 1) * pageSize;
}

/**
 * Builds a URL with filter and pagination parameters
 * Used when filters change to navigate to page 1 with filter state in URL
 *
 * @param {string} baseUrl - The base URL path (e.g., "/en/hotels")
 * @param {Object} filters - Filter object with arrays of selected values
 * @param {number} [page=1] - The page number (defaults to 1 for filter changes)
 * @returns {string} The complete URL with filter and page parameters
 *
 * Requirements: 6.1, 6.3
 */
export function buildFilteredUrl(baseUrl, filters, page = 1) {
  const params = new URLSearchParams();

  // Add filter parameters
  Object.entries(filters).forEach(([key, values]) => {
    if (Array.isArray(values) && values.length > 0) {
      // Join multiple values with comma for URL
      params.set(key, values.join(","));
    }
  });

  // Add page parameter (only if not page 1)
  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Parses filter parameters from URL search params
 *
 * @param {URLSearchParams|Object} searchParams - URL search params or object
 * @param {string[]} filterKeys - Array of filter keys to parse
 * @returns {Object} Parsed filters object with arrays of values
 *
 * Requirements: 6.3
 */
export function parseFiltersFromUrl(searchParams, filterKeys) {
  const filters = {};

  filterKeys.forEach((key) => {
    const value =
      searchParams instanceof URLSearchParams
        ? searchParams.get(key)
        : searchParams?.[key];

    if (value) {
      // Split comma-separated values into array
      filters[key] = value.split(",").filter(Boolean);
    } else {
      filters[key] = [];
    }
  });

  return filters;
}
