/**
 * meal-plan controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::meal-plan.meal-plan",
  ({ strapi }) => ({
    // Find all meal plans
    async find(ctx) {
      ctx.query = {
        ...ctx.query,
        populate: {
          inclusions: true,
          icon: true,
        },
        sort: "sortOrder:asc",
      };

      const { data, meta } = await super.find(ctx);
      return { data, meta };
    },

    // Find one meal plan by ID or code
    async findOne(ctx) {
      const { id } = ctx.params;
      const { locale } = ctx.query;

      // Check if ID is actually a code
      let mealPlan;
      if (isNaN(Number(id))) {
        // It's a code
        const mealPlans = await strapi
          .documents("api::meal-plan.meal-plan")
          .findMany({
            filters: { code: id },
            locale: (locale as string) || "en",
            populate: {
              inclusions: true,
              icon: true,
            },
          });
        mealPlan = mealPlans[0];
      } else {
        // It's an ID
        mealPlan = await strapi.documents("api::meal-plan.meal-plan").findOne({
          documentId: id,
          locale: (locale as string) || "en",
          populate: {
            inclusions: true,
            icon: true,
          },
        });
      }

      if (!mealPlan) {
        return ctx.notFound("Meal plan not found");
      }

      return { data: mealPlan };
    },
  })
);
