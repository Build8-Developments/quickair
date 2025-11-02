/**
 * Environment Configuration
 * Handles different environments (development, staging, production)
 */

// Get the current environment
export const ENV = process.env.NODE_ENV || "development";

// Strapi API Configuration
export const STRAPI_CONFIG = {
  // Base URL - automatically uses correct environment
  url: process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",

  // GraphQL endpoint
  graphqlEndpoint: "/graphql",

  // REST API endpoint (if needed)
  restEndpoint: "/api",

  // API Token (for authenticated requests)
  apiToken: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "",

  // Upload folder URL
  uploadsUrl: process.env.NEXT_PUBLIC_STRAPI_UPLOADS_URL || "",
};

// Full API URLs
export const API_URLS = {
  graphql: `${STRAPI_CONFIG.url}${STRAPI_CONFIG.graphqlEndpoint}`,
  rest: `${STRAPI_CONFIG.url}${STRAPI_CONFIG.restEndpoint}`,
  uploads: STRAPI_CONFIG.uploadsUrl || `${STRAPI_CONFIG.url}/uploads`,
};

// Default fetch options
export const DEFAULT_FETCH_OPTIONS = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Authenticated fetch options
export const AUTHENTICATED_FETCH_OPTIONS = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${STRAPI_CONFIG.apiToken}`,
  },
};

// Cache configuration
export const CACHE_CONFIG = {
  // Revalidate time in seconds
  revalidate: {
    static: 3600, // 1 hour for static content
    dynamic: 60, // 1 minute for dynamic content
    realtime: 0, // No cache for real-time data
  },

  // Cache tags for on-demand revalidation
  tags: {
    offers: "offers",
    tours: "tours",
    destinations: "destinations",
    blogs: "blogs",
  },
};

// Timeout configuration (in milliseconds)
export const TIMEOUT_CONFIG = {
  default: 10000, // 10 seconds
  upload: 30000, // 30 seconds for file uploads
  long: 60000, // 1 minute for long operations
};

// Error messages
export const ERROR_MESSAGES = {
  network: "Network error. Please check your connection.",
  timeout: "Request timeout. Please try again.",
  server: "Server error. Please try again later.",
  notFound: "Content not found.",
  unauthorized: "Unauthorized access.",
  validation: "Validation error. Please check your input.",
};

// Development helpers
export const IS_DEV = ENV === "development";
export const IS_PROD = ENV === "production";
export const IS_STAGING = process.env.NEXT_PUBLIC_ENV === "staging";

// Debug mode
export const DEBUG_MODE = IS_DEV || process.env.NEXT_PUBLIC_DEBUG === "true";

// Log configuration info in development
if (DEBUG_MODE) {
  console.log("🔧 API Configuration:", {
    environment: ENV,
    strapiUrl: STRAPI_CONFIG.url,
    graphqlEndpoint: API_URLS.graphql,
    hasApiToken: !!STRAPI_CONFIG.apiToken,
  });
}

export default {
  ENV,
  STRAPI_CONFIG,
  API_URLS,
  DEFAULT_FETCH_OPTIONS,
  AUTHENTICATED_FETCH_OPTIONS,
  CACHE_CONFIG,
  TIMEOUT_CONFIG,
  ERROR_MESSAGES,
  IS_DEV,
  IS_PROD,
  IS_STAGING,
  DEBUG_MODE,
};
