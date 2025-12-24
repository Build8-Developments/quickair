/**
 * hotel router
 */

import { factories } from "@strapi/strapi";

const defaultRouter = factories.createCoreRouter("api::hotel.hotel");

const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: "GET",
    path: "/hotels/location/:locationSlug",
    handler: "hotel.byLocation",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/hotels/featured",
    handler: "hotel.featured",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/hotels/search",
    handler: "hotel.search",
    config: {
      auth: false,
    },
  },
];

export default customRouter(defaultRouter, myExtraRoutes);
