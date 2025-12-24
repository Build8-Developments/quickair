export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      origin: [
        "https://quickair.build8.dev",
        "https://quickair-new.build8.dev",
        "https://quickair-admin.build8.dev",
        "https://quickair-admin-new.build8.dev",
        "http://localhost:3000",
        "http://localhost:1337",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: [
        "Content-Type",
        "Authorization",
        "Origin",
        "Accept",
        "X-Requested-With",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
      ],
      credentials: true,
      keepHeaderOnError: true,
      maxAge: 86400, // 24 hours
    },
  },
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
