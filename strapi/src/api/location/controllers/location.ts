/**
 * location controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::location.location', ({ strapi }) => ({
  /**
   * Find all locations with bilingual support
   * Supports filtering, pagination, and locale-specific queries
   */
  async find(ctx) {
    // Sanitize query parameters
    const sanitizedQueryParams = await this.sanitizeQuery(ctx);
    
    // Get locale from query or default to 'en'
    const locale = ctx.query.locale || 'en';
    
    // Fetch entities with locale
    const { results, pagination } = await strapi.service('api::location.location').find({
      ...sanitizedQueryParams,
      locale,
      populate: {
        image: true,
        seo: true,
      },
    });

    // Sanitize output
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  },

  /**
   * Find one location by ID or slug
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const locale = ctx.query.locale || 'en';

    // Check if id is a slug or numeric ID
    const isSlug = isNaN(Number(id));

    let entity;
    
    if (isSlug) {
      // Find by slug
      const entities = await strapi.db.query('api::location.location').findMany({
        where: { slug: id, locale },
        populate: {
          image: true,
          seo: true,
          offers: {
            populate: ['coverImage', 'hotelOptions'],
          },
        },
      });
      entity = entities[0];
    } else {
      // Find by ID
      entity = await strapi.service('api::location.location').findOne(id, {
        locale,
        populate: {
          image: true,
          seo: true,
          offers: {
            populate: ['coverImage', 'hotelOptions'],
          },
        },
      });
    }

    if (!entity) {
      return ctx.notFound('Location not found');
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },

  /**
   * Search locations by name (supports both EN and AR)
   * Example: /api/locations/search?q=بالي&locale=ar
   */
  async search(ctx) {
    const { query: searchQuery } = ctx.request.query;
    const locale = ctx.query.locale || 'en';

    if (!searchQuery) {
      return ctx.badRequest('Search query is required');
    }

    try {
      // Search in both current locale
      const results = await strapi.db.query('api::location.location').findMany({
        where: {
          $or: [
            { name: { $containsi: searchQuery } },
            { country: { $containsi: searchQuery } },
            { shortDescription: { $containsi: searchQuery } },
          ],
          locale,
          publishedAt: { $notNull: true },
        },
        populate: {
          image: true,
        },
        limit: 10,
      });

      const sanitizedResults = await this.sanitizeOutput(results, ctx);

      return this.transformResponse(sanitizedResults);
    } catch (error) {
      return ctx.internalServerError('Search failed', { error: error.message });
    }
  },

  /**
   * Get all featured locations
   */
  async featured(ctx) {
    const locale = ctx.query.locale || 'en';

    try {
      const results = await strapi.db.query('api::location.location').findMany({
        where: {
          featured: true,
          locale,
          publishedAt: { $notNull: true },
        },
        populate: {
          image: true,
        },
        orderBy: { name: 'asc' },
      });

      const sanitizedResults = await this.sanitizeOutput(results, ctx);

      return this.transformResponse(sanitizedResults);
    } catch (error) {
      return ctx.internalServerError('Failed to fetch featured locations', { error: error.message });
    }
  },

  /**
   * Get locations grouped by type
   */
  async byType(ctx) {
    const locale = ctx.query.locale || 'en';

    try {
      const locations = await strapi.db.query('api::location.location').findMany({
        where: {
          locale,
          publishedAt: { $notNull: true },
        },
        populate: {
          image: true,
        },
        orderBy: { name: 'asc' },
      });

      // Group by type
      const grouped = locations.reduce((acc, location) => {
        const type = location.type || 'Other';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(location);
        return acc;
      }, {});

      const sanitizedResults = await this.sanitizeOutput(grouped, ctx);

      return this.transformResponse(sanitizedResults);
    } catch (error) {
      return ctx.internalServerError('Failed to group locations', { error: error.message });
    }
  },
}));
