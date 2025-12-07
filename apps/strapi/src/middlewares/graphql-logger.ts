/**
 * `graphql-logger` middleware
 * Logs GraphQL request content for debugging and monitoring
 */

import type { Core } from "@strapi/strapi";
import getRawBody from "raw-body";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    // Check if this is a GraphQL request
    const isGraphQL = ctx.url.includes("/graphql") && ctx.method === "POST";

    if (isGraphQL) {
      const startTime = Date.now();

      // Read raw body before it's consumed
      let requestBody: any = null;

      try {
        const rawBody = await getRawBody(ctx.req, {
          length: ctx.request.length,
          limit: "1mb",
          encoding: "utf-8",
        });

        requestBody = JSON.parse(rawBody);

        // Re-attach body for downstream middleware
        ctx.request.body = requestBody;
      } catch (e) {
        console.log("[ERROR] Failed to parse GraphQL body:", e.message);
      }

      // Log the incoming GraphQL request
      console.log("==================== GraphQL Request ====================");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Method:", ctx.method);
      console.log("URL:", ctx.url);
      console.log("Operation Name:", requestBody?.operationName || "N/A");
      console.log("Query:");
      console.log(requestBody?.query || "N/A");
      console.log(
        "Variables:",
        JSON.stringify(requestBody?.variables, null, 2) || "N/A"
      );
      console.log("User-Agent:", ctx.request.headers["user-agent"]);
      console.log("IP:", ctx.request.ip);
      console.log("========================================================");

      // Continue to the next middleware
      await next();

      // Log the response time
      const duration = Date.now() - startTime;
      console.log("==================== GraphQL Response ====================");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Operation Name:", requestBody?.operationName || "N/A");
      console.log("Duration:", `${duration}ms`);
      console.log("Status Code:", ctx.status);
      console.log("=========================================================");
    } else {
      // For non-GraphQL requests, just pass through
      await next();
    }
  };
};
