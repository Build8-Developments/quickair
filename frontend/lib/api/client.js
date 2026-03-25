/**
 * Base API Client for Strapi GraphQL
 * Handles all GraphQL requests with error handling and retry logic
 */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const GRAPHQL_ENDPOINT = `${STRAPI_URL}/graphql`;

/**
 * Execute a GraphQL query
 * @param {string} query - GraphQL query string
 * @param {object} variables - Query variables
 * @param {object} options - Additional options (cache, headers, etc.)
 * @returns {Promise<any>} Query result
 */
export async function executeGraphQL(query, variables = {}, options = {}) {
  // Default to force-cache with revalidation for optimal ISR behavior
  const {
    cache = "force-cache",
    next = { revalidate: 60 },
    headers = {},
    timeout = 25000,
  } = options;

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
      next,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check content type to avoid parsing HTML error pages as JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      throw new Error(
        `Expected JSON response but got: ${contentType || "unknown"}`,
      );
    }

    // Get response text first to handle potential parsing errors
    const responseText = await response.text();

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("Response preview:", responseText.substring(0, 600));
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

    // Check for GraphQL errors
    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error(result.errors[0]?.message || "GraphQL query failed");
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Only log errors at runtime, not during build
    if (
      process.env.NODE_ENV !== "production" ||
      typeof window !== "undefined"
    ) {
      console.error("GraphQL Request Failed:", error);
    }
    throw error;
  }
}

/**
 * Execute a REST API request to Strapi
 * @param {string} endpoint - API endpoint (e.g., '/api/locations')
 * @param {object} options - Fetch options
 * @returns {Promise<any>} API response
 */
export async function executeREST(endpoint, options = {}) {
  const {
    method = "GET",
    body = null,
    headers = {},
    cache = "no-store",
    next = {},
  } = options;

  const url = `${STRAPI_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
      cache,
      next,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("REST Request Failed:", error);
    throw error;
  }
}

/**
 * Helper to build query parameters
 * @param {object} params - Parameters object
 * @returns {string} URL query string
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}
