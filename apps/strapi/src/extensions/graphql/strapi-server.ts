module.exports = (plugin) => {
  // Extend the GraphQL plugin to add custom resolvers with optimizations
  plugin.register = async ({ strapi }) => {
    const extensionService = strapi.plugin("graphql").service("extension");

    // Override the Offer resolver to add populate
    extensionService.shadowCRUD("api::offer.offer").field("hotelOptions", {
      resolve: async (parent, args, context) => {
        const { id } = parent;

        // Use populate to avoid N+1 queries
        const offer = await strapi.entityService.findOne(
          "api::offer.offer",
          id,
          {
            populate: {
              hotelOptions: {
                populate: {
                  hotel: {
                    populate: ["location", "amenities"],
                  },
                  mealPlan: true,
                  roomPricing: true,
                },
              },
            },
          }
        );

        return offer?.hotelOptions || [];
      },
    });
  };

  return plugin;
};
