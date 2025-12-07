export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  {
    name: "global::graphql-logger",
    config: {},
  },
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
