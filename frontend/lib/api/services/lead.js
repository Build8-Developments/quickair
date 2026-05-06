/**
 * Lead Service
 * Handles all lead-related API calls to Strapi
 */

import { executeREST } from "../client";

/**
 * Create a new lead in Strapi
 * @param {object} leadData - Lead information
 * @param {string} leadData.contact - Email or phone number
 * @param {string} leadData.contactType - 'email' or 'phone'
 * @param {string} leadData.preferredContact - 'whatsapp', 'email', or 'phone'
 * @param {string} leadData.source - Source of the lead (e.g., 'offers_popup', 'booking_form')
 * @param {string} leadData.language - User's language preference
 * @param {string} leadData.name - Optional: User's name
 * @param {object} leadData.metadata - Optional: Additional metadata
 * @returns {Promise<object>} Created lead object
 */
export async function createLead(leadData) {
  try {
    const {
      contact,
      contactType,
      preferredContact = "whatsapp",
      source = "website",
      language = "ar",
      name = null,
      metadata = {},
    } = leadData;

    // Validate required fields
    if (!contact) {
      throw new Error("Contact information is required");
    }

    // Prepare data for Strapi
    const strapiData = {
      data: {
        contact,
        contactType: contactType || (contact.includes("@") ? "email" : "phone"),
        preferredContact,
        source,
        language,
        name,
        status: "new", // Default status
        metadata: metadata ? JSON.stringify(metadata) : null,
        createdAt: new Date().toISOString(),
      },
    };

    console.log("[LeadService] Creating lead in Strapi:", strapiData);

    // Send to Strapi REST API
    const response = await executeREST("/api/leads", {
      method: "POST",
      body: strapiData,
      cache: "no-store",
    });

    console.log("[LeadService] Lead created successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error("[LeadService] Error creating lead:", error);
    throw error;
  }
}

/**
 * Get all leads (for admin dashboard)
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.pageSize - Items per page
 * @param {string} params.sort - Sort order
 * @param {object} params.filters - Filters
 * @returns {Promise<object>} Paginated leads
 */
export async function getAllLeads({
  page = 1,
  pageSize = 25,
  sort = "createdAt:desc",
  filters = {},
} = {}) {
  try {
    const start = (page - 1) * pageSize;

    const response = await executeREST(
      `/api/leads?pagination[start]=${start}&pagination[limit]=${pageSize}&sort=${sort}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return {
      data: response.data || [],
      meta: response.meta || {},
    };
  } catch (error) {
    console.error("[LeadService] Error fetching leads:", error);
    return {
      data: [],
      meta: {},
    };
  }
}

/**
 * Update lead status
 * @param {string} leadId - Lead ID
 * @param {string} status - New status ('new', 'contacted', 'converted', 'lost')
 * @returns {Promise<object>} Updated lead
 */
export async function updateLeadStatus(leadId, status) {
  try {
    if (!leadId || !status) {
      throw new Error("Lead ID and status are required");
    }

    const response = await executeREST(`/api/leads/${leadId}`, {
      method: "PUT",
      body: {
        data: {
          status,
          updatedAt: new Date().toISOString(),
        },
      },
      cache: "no-store",
    });

    return response.data;
  } catch (error) {
    console.error("[LeadService] Error updating lead status:", error);
    throw error;
  }
}

/**
 * Add notes to a lead
 * @param {string} leadId - Lead ID
 * @param {string} notes - Notes to add
 * @returns {Promise<object>} Updated lead
 */
export async function addLeadNotes(leadId, notes) {
  try {
    if (!leadId || !notes) {
      throw new Error("Lead ID and notes are required");
    }

    const response = await executeREST(`/api/leads/${leadId}`, {
      method: "PUT",
      body: {
        data: {
          notes,
          updatedAt: new Date().toISOString(),
        },
      },
      cache: "no-store",
    });

    return response.data;
  } catch (error) {
    console.error("[LeadService] Error adding lead notes:", error);
    throw error;
  }
}
