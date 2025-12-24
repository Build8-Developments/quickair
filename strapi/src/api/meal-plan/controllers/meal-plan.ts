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
        sort: "sortOrder:asc",
      };

      const { data, meta } = await super.find(ctx);
      return { data, meta };
    },

    // Find one meal plan by ID or code
    async findOne(ctx) {
      const { id } = ctx.params;
      const { locale } = ctx.query;

      const mealPlan = await strapi
        .documents("api::meal-plan.meal-plan")
        .findOne({
          documentId: id,
          locale: (locale as string) || "en",
        });

      if (!mealPlan) {
        return ctx.notFound("Meal plan not found");
      }

      return { data: mealPlan };
    },
  })
);
