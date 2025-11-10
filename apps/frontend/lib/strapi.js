/**
 * Get the full Strapi URL for media files
 * @param {string} path - The path returned from Strapi (e.g., "/uploads/image.jpg")
 * @returns {string} - Full URL (e.g., "http://localhost:1337/uploads/image.jpg")
 */
export function getStrapiURL(path) {
  if (!path) return "";

  // If path already includes http/https, return as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Get Strapi base URL from environment variable or use default
  const strapiURL =
    process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${strapiURL}${normalizedPath}`;
}

/**
 * Get Strapi media URL with optional fallback
 * @param {object} media - Strapi media object with url property
 * @param {string} fallback - Optional fallback URL
 * @returns {string}
 */
export function getStrapiMediaURL(media, fallback = "") {
  if (!media?.url) return fallback;
  return getStrapiURL(media.url);
}
