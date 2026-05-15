/**
 * Helpers for reading Haj / Umrah page content from Strapi JSON
 */

export function getContentValue(content, path) {
  if (!content || !path) return undefined;
  return path.split(".").reduce((obj, key) => {
    if (obj == null) return undefined;
    return obj[key];
  }, content);
}

/**
 * @param {object|null} content - Strapi `content` JSON
 * @param {string} namespace - i18n prefix e.g. "haj" | "omra"
 * @param {Function} t - react-i18next t()
 */
export function createPilgrimageText(content, namespace, t) {
  return function pt(key, options = {}) {
    let path = key;
    if (path.startsWith(`${namespace}.`)) {
      path = path.slice(namespace.length + 1);
    }

    const value = getContentValue(content, path);

    if (value !== undefined && value !== null) {
      if (options.returnObjects && typeof value === "object") {
        return value;
      }
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return String(value);
      }
    }

    return t(`${namespace}.${path}`, options);
  };
}

export function getMediaUrl(media, key, fallback = "") {
  if (!media || !key) return fallback;
  return media[key] || fallback;
}
