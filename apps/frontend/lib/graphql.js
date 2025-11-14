import {
  API_URLS,
  DEFAULT_FETCH_OPTIONS,
  AUTHENTICATED_FETCH_OPTIONS,
  TIMEOUT_CONFIG,
  ERROR_MESSAGES,
  DEBUG_MODE,
} from "@/config/api";

/**
 * GraphQL Client for Strapi
 * Centralized GraphQL request handler with error handling, timeout, and logging
 */

/**
 * Execute a GraphQL query
 * @param {string} query - GraphQL query string
 * @param {object} variables - Query variables
 * @param {object} options - Additional options
 * @returns {Promise<object>} Query result
 */
export async function graphqlRequest(query, variables = {}, options = {}) {
  const {
    authenticated = false,
    timeout = TIMEOUT_CONFIG.default,
    cache = "default",
    revalidate,
    tags = [],
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    if (DEBUG_MODE) {
      console.log("📡 GraphQL Request:", {
        query: query.substring(0, 100) + "...",
        variables,
        authenticated,
      });
    }

    const fetchOptions = authenticated
      ? AUTHENTICATED_FETCH_OPTIONS
      : DEFAULT_FETCH_OPTIONS;

    const response = await fetch(API_URLS.graphql, {
      method: "POST",
      headers: fetchOptions.headers,
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      cache,
      ...(revalidate !== undefined && { next: { revalidate } }),
      ...(tags.length > 0 && { next: { tags } }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error("❌ GraphQL Errors:", result.errors);
      throw new GraphQLError(result.errors);
    }

    if (DEBUG_MODE) {
      console.log("✅ GraphQL Response:", result.data);
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.error("⏱️ Request timeout");
      throw new Error(ERROR_MESSAGES.timeout);
    }

    if (error instanceof GraphQLError) {
      throw error;
    }

    console.error("❌ GraphQL Request failed:", error);
    throw new Error(ERROR_MESSAGES.network);
  }
}

/**
 * Execute a GraphQL mutation
 * @param {string} mutation - GraphQL mutation string
 * @param {object} variables - Mutation variables
 * @param {object} options - Additional options
 * @returns {Promise<object>} Mutation result
 */
export async function graphqlMutation(mutation, variables = {}, options = {}) {
  // Mutations are always authenticated by default
  return graphqlRequest(mutation, variables, {
    authenticated: true,
    cache: "no-store",
    ...options,
  });
}

/**
 * Custom GraphQL Error class
 */
export class GraphQLError extends Error {
  constructor(errors) {
    super("GraphQL request failed");
    this.name = "GraphQLError";
    this.errors = errors;
    this.message = errors.map((e) => e.message).join(", ");
  }
}

/**
 * Batch multiple GraphQL queries into one request
 * @param {Array} queries - Array of {query, variables} objects
 * @param {object} options - Additional options
 * @returns {Promise<Array>} Array of results
 */
export async function graphqlBatch(queries, options = {}) {
  const batchQuery = queries.map((q, index) => ({
    query: q.query,
    variables: q.variables || {},
    operationName: `Operation${index}`,
  }));

  try {
    const results = await Promise.all(
      batchQuery.map(({ query, variables }) =>
        graphqlRequest(query, variables, options)
      )
    );

    return results;
  } catch (error) {
    console.error("❌ Batch request failed:", error);
    throw error;
  }
}

/**
 * Helper to format image URLs from Strapi
 * @param {string|object} image - Image URL or image object from Strapi
 * @returns {string|null} Full image URL
 */
export function formatImageUrl(image) {
  if (!image) return null;

  // If it's an object (Strapi format)
  if (typeof image === "object") {
    const url = image.data?.attributes?.url || image.url;
    if (!url) return null;
    return url.startsWith("http") ? url : `${API_URLS.uploads}${url}`;
  }

  // If it's a string
  if (typeof image === "string") {
    return image.startsWith("http") ? image : `${API_URLS.uploads}${image}`;
  }

  return null;
}

/**
 * Helper to extract data from Strapi GraphQL response
 * @param {object} response - GraphQL response
 * @param {string} key - Data key
 * @returns {Array|object|null} Extracted data
 */
export function extractStrapiData(response, key) {
  if (!response || !response[key]) return null;

  const data = response[key].data;

  if (!data) return null;

  // If it's an array, map and return attributes
  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }));
  }

  // If it's a single item, return attributes
  return {
    id: data.id,
    ...data.attributes,
  };
}

/**
 * Helper to handle pagination
 * @param {object} response - GraphQL response with pagination
 * @param {string} key - Data key
 * @returns {object} Data with pagination info
 */
export function extractPaginatedData(response, key) {
  if (!response || !response[key]) return { data: [], pagination: null };

  const data = extractStrapiData(response, key);
  const meta = response[key].meta;

  return {
    data,
    pagination: meta?.pagination || null,
  };
}

export default {
  graphqlRequest,
  graphqlMutation,
  graphqlBatch,
  formatImageUrl,
  extractStrapiData,
  extractPaginatedData,
  GraphQLError,
};
