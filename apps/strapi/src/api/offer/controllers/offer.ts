/**
 * offer controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::offer.offer",
  ({ strapi }) => ({
    async find(ctx) {
      // Add deep populate for GraphQL queries
      const populate = {
        coverImage: true,
        location: {
          populate: ["country"],
        },
        hotelOptions: {
          populate: {
            hotel: {
              populate: {
                location: true,
                amenities: true,
              },
            },
            mealPlan: true,
            roomPricing: true,
            kidsPricing: true,
          },
        },
        optionalTrips: true,
        inclusions: true,
        exclusions: true,
      };

      // Merge with any existing populate from the request
      ctx.query = {
        ...ctx.query,
        populate: ctx.query.populate || populate,
      };

      // Call the default core action
      const { data, meta } = await super.find(ctx);

      return { data, meta };
    },

    async findOne(ctx) {
      const populate = {
        coverImage: true,
        gallery: true,
        pdfFile: true,
        location: {
          populate: ["country"],
        },
        hotelOptions: {
          populate: {
            hotel: {
              populate: {
                location: true,
                amenities: true,
              },
            },
            mealPlan: true,
            roomPricing: true,
            kidsPricing: true,
          },
        },
        optionalTrips: true,
        inclusions: true,
        exclusions: true,
      };

      ctx.query = {
        ...ctx.query,
        populate: ctx.query.populate || populate,
      };

      const { data, meta } = await super.findOne(ctx);

      return { data, meta };
    },
  })
);
