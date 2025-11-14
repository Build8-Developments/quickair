/**
 * API Services Index
 * Central export point for all API services
 *
 * Usage:
 * import { locationService, offerService } from '@/lib/api';
 * const locations = await locationService.searchLocations({ query: 'bali', locale: 'en' });
 * const offers = await offerService.getOfferBySlug({ slug: 'bali-beach-escape', locale: 'en' });
 */

import * as locationService from "./services/location";
import * as offerService from "./services/offer";

export { locationService, offerService };

// Export client for advanced usage
export { executeGraphQL, executeREST, buildQueryString } from "./client";
