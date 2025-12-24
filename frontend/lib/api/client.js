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
  const { cache = "no-store", next = {}, headers = {} } = options;

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
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Check for GraphQL errors
    if (result.errors) {
      console.error("GraphQL Errors:", result.errors);
      throw new Error(result.errors[0]?.message || "GraphQL query failed");
    }

    return result.data;
  } catch (error) {
    console.error("GraphQL Request Failed:", error);
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
