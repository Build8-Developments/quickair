/**
 * location service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::location.location', ({ strapi }) => ({
  /**
   * Custom method to find location with all localizations
   */
  async findWithLocalizations(id: number) {
    const entity = await strapi.entityService.findOne('api::location.location', id, {
      populate: {
        localizations: {
          populate: ['image', 'seo'],
        },
        image: true,
        seo: true,
        offers: {
          populate: ['coverImage', 'hotelOptions'],
        },
      },
    });

    return entity;
  },

  /**
   * Get location statistics
   */
  async getStatistics(locationId: number) {
    const location: any = await strapi.entityService.findOne('api::location.location', locationId, {
      populate: {
        offers: {
          filters: {
            publishedAt: { $notNull: true },
          },
        },
      },
    });

    if (!location) {
      return null;
    }

    return {
      totalOffers: location.offers?.length || 0,
      locationName: location.name,
      locationType: location.type,
    };
  },

  /**
   * Check if location name is unique across all locales
   */
  async isNameUnique(name: string, excludeId?: number) {
    const filters: any = {
      name: { $eqi: name }, // Case-insensitive equals
    };

    if (excludeId) {
      filters.id = { $ne: excludeId };
    }

    const count = await strapi.db.query('api::location.location').count({
      where: filters,
    });

    return count === 0;
  },
}));
