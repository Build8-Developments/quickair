/**
 * hotel controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::hotel.hotel",
  ({ strapi }) => ({
    // Find hotels with optional filtering
    async find(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: {
          location: true,
          amenities: true,
          images: true,
          coverImage: true,
          coordinates: true,
          seo: {
            populate: ["metaImage"],
          },
        },
      };

      const { data, meta } = await super.find(ctx);
      return { data, meta };
    },

    // Find one hotel by ID or slug
    async findOne(ctx) {
      const { id } = ctx.params;
      const { locale } = ctx.query;

      // Check if ID is actually a slug
      let hotel;
      if (isNaN(Number(id))) {
        // It's a slug
        const hotels = await strapi.documents("api::hotel.hotel").findMany({
          filters: { slug: id },
          locale: (locale as string) || "en",
          populate: {
            location: true,
            amenities: true,
            images: true,
            coverImage: true,
            coordinates: true,
            seo: {
              populate: ["metaImage"],
            },
          },
        });
        hotel = hotels[0];
      } else {
        // It's an ID
        hotel = await strapi.documents("api::hotel.hotel").findOne({
          documentId: id,
          locale: (locale as string) || "en",
          populate: {
            location: true,
            amenities: true,
            images: true,
            coverImage: true,
            coordinates: true,
            seo: {
              populate: ["metaImage"],
            },
          },
        });
      }

      if (!hotel) {
        return ctx.notFound("Hotel not found");
      }

      return { data: hotel };
    },

    // Get hotels by location
    async byLocation(ctx) {
      const { locationSlug } = ctx.params;
      const { locale } = ctx.query;

      // First find the location
      const locations = await strapi
        .documents("api::location.location")
        .findMany({
          filters: { slug: locationSlug },
          locale: (locale as string) || "en",
        });

      if (!locations || locations.length === 0) {
        return ctx.notFound("Location not found");
      }

      const location = locations[0];

      // Find hotels for this location
      const hotels = await strapi.documents("api::hotel.hotel").findMany({
        filters: {
          location: {
            documentId: location.documentId,
          },
        },
        locale: (locale as string) || "en",
        populate: {
          location: true,
          amenities: true,
          images: true,
          coverImage: true,
          coordinates: true,
        },
      });

      return { data: hotels };
    },

    // Get featured hotels
    async featured(ctx) {
      const { locale, limit = 20 } = ctx.query;

      const hotels = await strapi.documents("api::hotel.hotel").findMany({
        filters: { featured: true },
        locale: (locale as string) || "en",
        limit: Number(limit),
        populate: {
          location: true,
          coverImage: true,
          images: true,
          amenities: true,
        },
      });

      return { data: hotels };
    },

    // Search hotels
    async search(ctx) {
      const { query, locale, limit = 20 } = ctx.query;

      if (!query) {
        return { data: [] };
      }

      const hotels = await strapi.documents("api::hotel.hotel").findMany({
        filters: {
          $or: [
            { name: { $containsi: query as string } },
            { chain: { $containsi: query as string } },
            { address: { $containsi: query as string } },
          ],
        },
        locale: (locale as string) || "en",
        limit: Number(limit),
        populate: {
          location: true,
          coverImage: true,
        },
      });

      return { data: hotels };
    },
  })
);
