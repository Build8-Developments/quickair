import {
  API_URLS,
  STRAPI_CONFIG,
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

// Helper to log errors only at runtime (not during build)
const shouldLog = () =>
  process.env.NODE_ENV !== "production" || typeof window !== "undefined";

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

    // Build headers dynamically at request time so the token is always read
    // from the current env value rather than a stale module-load-time snapshot.
    const apiToken =
      STRAPI_CONFIG.apiToken ||
      process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
      process.env.STRAPI_API_TOKEN;
    const useAuth = authenticated || !!apiToken;
    const requestHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      "Accept-Charset": "utf-8",
      ...(useAuth && apiToken ? { Authorization: `Bearer ${apiToken}` } : {}),
    };

    // Build `next` option by merging revalidate and tags together so they
    // don't overwrite each other.  When `next` is provided, omit `cache`
    // because Next.js treats them as mutually exclusive.
    const nextOption = {};
    if (revalidate !== undefined) nextOption.revalidate = revalidate;
    if (tags.length > 0) nextOption.tags = tags;
    const hasNext = Object.keys(nextOption).length > 0;

    const response = await fetch(API_URLS.graphql, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      ...(hasNext ? { next: nextOption } : { cache }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      if (shouldLog())
        console.error(
          `❌ HTTP ${response.status} response body:`,
          errText.substring(0, 600),
        );
      try {
        const errJson = JSON.parse(errText);
        if (errJson?.errors?.length) {
          throw new GraphQLError(errJson.errors);
        }
      } catch (parseErr) {
        if (parseErr instanceof GraphQLError) throw parseErr;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check content type to avoid parsing HTML error pages as JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      if (shouldLog())
        console.error("❌ Non-JSON response:", text.substring(0, 200));
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
      if (shouldLog()) {
        console.error("❌ JSON parse error:", parseError.message);
        console.error("Response preview:", responseText.substring(0, 600));
      }
      throw new Error(`Invalid JSON response: ${parseError.message}`);
    }

    if (result.errors) {
      if (shouldLog()) console.error("❌ GraphQL Errors:", result.errors);
      throw new GraphQLError(result.errors);
    }

    if (DEBUG_MODE) {
      console.log("✅ GraphQL Response:", result.data);
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      if (shouldLog()) console.error("⏱️ Request timeout");
      throw new Error(ERROR_MESSAGES.timeout);
    }

    if (error instanceof GraphQLError) {
      throw error;
    }

    if (shouldLog()) console.error("❌ GraphQL Request failed:", error);
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
        graphqlRequest(query, variables, options),
      ),
    );

    return results;
  } catch (error) {
    if (shouldLog()) console.error("❌ Batch request failed:", error);
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

  // If it's an object
  if (typeof image === "object") {
    // Strapi v5: flat { url, alternativeText }
    // Strapi v4: { data: { attributes: { url } } }
    const url = image.url || image.data?.attributes?.url;
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

  const collection = response[key];

  // Strapi v5: response is a direct array of flat objects
  if (Array.isArray(collection)) {
    return collection.map((item) => ({
      id: item.documentId ?? item.id,
      ...item,
    }));
  }

  // Strapi v4 compat: { data: [{ id, attributes }] }
  const data = collection.data;
  if (!data) return null;

  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: item.id,
      ...item.attributes,
    }));
  }

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
/**
 * Extract a Strapi single-type entry from GraphQL response
 */
export function extractStrapiSingle(response, key) {
  if (!response || !response[key]) return null;

  const item = response[key];

  if (Array.isArray(item)) {
    return item[0]
      ? { id: item[0].documentId ?? item[0].id, ...item[0] }
      : null;
  }

  if (item?.data) {
    const data = item.data;
    return {
      id: data.id ?? data.documentId,
      ...(data.attributes || data),
    };
  }

  if (typeof item === "object") {
    return { id: item.documentId ?? item.id, ...item };
  }

  return null;
}

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
  extractStrapiSingle,
  extractPaginatedData,
  GraphQLError,
};
