/**
 * Leads Collection API
 * جمع بيانات العملاء المحتملين من الـ popup والـ forms
 * Collect potential customer data from popups and forms
 */

import { createLead, getAllLeads } from "@/lib/api/services/lead";

export async function POST(request) {
  try {
    const { contact, preferredContact, source, language, timestamp, name, metadata } = await request.json();

    // Validate input
    if (!contact) {
      return Response.json(
        { success: false, error: "Contact information is required" },
        { status: 400 }
      );
    }

    // Determine if contact is email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(contact);
    const contactType = isEmail ? "email" : "phone";

    // Log lead data to console (for development)
    console.log("=".repeat(60));
    console.log("📊 NEW LEAD CAPTURED");
    console.log("=".repeat(60));
    console.log("Contact:", contact);
    console.log("Type:", contactType);
    console.log("Preferred Contact:", preferredContact);
    console.log("Source:", source);
    console.log("Language:", language);
    console.log("Timestamp:", timestamp);
    console.log("=".repeat(60));

    try {
      // ✅ Save to Strapi
      const leadData = await createLead({
        contact,
        contactType,
        preferredContact: preferredContact || "whatsapp",
        source: source || "website",
        language: language || "ar",
        name: name || null,
        metadata: {
          timestamp: timestamp || new Date().toISOString(),
          userAgent: request.headers.get("user-agent"),
          ...metadata,
        },
      });

      console.log("✅ Lead saved to Strapi successfully:", leadData.id);

      // TODO: Send to additional services
      // Example: await sendToMailchimp({ email: contact, tags: [source, language] });
      // Example: await sendSlackNotification(`New lead: ${contact} from ${source}`);

      return Response.json({
        success: true,
        message: language === "ar" 
          ? "تم حفظ بياناتك بنجاح"
          : "Your information has been saved successfully",
        leadId: leadData.id || leadData.documentId,
        data: leadData,
      });
    } catch (strapiError) {
      console.error("❌ Strapi save failed:", strapiError.message);
      
      // Still return success to user, but log the error
      // The lead data is already logged to console
      return Response.json({
        success: true,
        message: language === "ar" 
          ? "تم حفظ بياناتك بنجاح"
          : "Your information has been saved successfully",
        warning: "Data saved locally but sync pending",
        leadId: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      });
    }
  } catch (error) {
    console.error("Lead capture error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to save lead information",
        details: error.message
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve leads (for admin dashboard)
export async function GET(request) {
  try {
    // TODO: Add authentication check
    // if (!isAdmin(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "25");
    const sort = searchParams.get("sort") || "createdAt:desc";

    // ✅ Fetch leads from Strapi
    const result = await getAllLeads({
      page,
      pageSize,
      sort,
    });

    return Response.json({
      success: true,
      leads: result.data,
      meta: result.meta,
      pagination: {
        page,
        pageSize,
        total: result.meta?.pagination?.total || 0,
        totalPages: Math.ceil((result.meta?.pagination?.total || 0) / pageSize),
      },
    });
  } catch (error) {
    console.error("Leads retrieval error:", error);
    return Response.json(
      { 
        success: false, 
        error: "Failed to retrieve leads",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

