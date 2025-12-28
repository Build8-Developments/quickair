import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Helper function to extract display value from tripData fields
const extractValue = (value, field, isArabic) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  
  switch (field) {
    case "destination":
      return isArabic ? (value.name_ar || value.name) : (value.name || value.name_en);
    case "budget":
      return value.label || `${value.min || 0} - ${value.max || 0}`;
    case "travelers":
      if (value.total) return value.total;
      const adults = value.adults || 0;
      const children = value.children || 0;
      return isArabic 
        ? `${adults} بالغ${children > 0 ? ` و ${children} طفل` : ""}`
        : `${adults} Adult${adults > 1 ? "s" : ""}${children > 0 ? `, ${children} Child${children > 1 ? "ren" : ""}` : ""}`;
    case "dates":
      if (value.startDate && value.endDate) {
        return `${value.startDate} - ${value.endDate}`;
      }
      return value.startDate || value.endDate || null;
    case "mealPlan":
    case "roomType":
      return value.label || value.name || value;
    case "hotel":
      return isArabic ? (value.hotel_name_ar || value.hotel_name_en) : (value.hotel_name_en || value.hotel_name_ar);
    default:
      return value.label || value.name || JSON.stringify(value);
  }
};

export async function POST(request) {
  try {
    const { userInfo, tripData, messages, language } = await request.json();
    const isArabic = language === "ar";
    
    // Extract display values from tripData
    const displayData = {
      destination: extractValue(tripData.destination, "destination", isArabic),
      budget: extractValue(tripData.budget, "budget", isArabic),
      travelers: extractValue(tripData.travelers, "travelers", isArabic),
      dates: extractValue(tripData.dates, "dates", isArabic),
      mealPlan: extractValue(tripData.mealPlan, "mealPlan", isArabic),
      roomType: extractValue(tripData.roomType, "roomType", isArabic),
      hotel: extractValue(tripData.selectedHotel, "hotel", isArabic),
    };

    // Log summary to console (for development)
    console.log("=".repeat(60));
    console.log("TRIP SUMMARY REQUEST");
    console.log("=".repeat(60));
    console.log("Customer:", userInfo);
    console.log("Trip:", tripData);
    console.log("Display Data:", displayData);
    console.log("Language:", language);
    console.log("=".repeat(60));

    // Check if SMTP is configured
    const smtpConfigured = process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD;

    if (smtpConfigured) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2',
        },
      });

      const emailSubject = isArabic
        ? `ملخص حجزك - ${userInfo.name} | QuickAir`
        : `Your Booking Summary - ${userInfo.name} | QuickAir`;

      const emailHTML = generateEmailHTML(userInfo, displayData, isArabic);

      await transporter.sendMail({
        from: `"QuickAir" <${process.env.GMAIL_USER}>`,
        to: userInfo.email,
        subject: emailSubject,
        html: emailHTML,
      });

      await transporter.sendMail({
        from: `"QuickAir Chatbot" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
        subject: isArabic ? `طلب حجز جديد - ${userInfo.name}` : `New Booking Request - ${userInfo.name}`,
        html: emailHTML,
      });

      console.log("Summary emails sent successfully");
    } else {
      console.log("SMTP not configured - Summary saved to console only");
    }

    return NextResponse.json({
      success: true,
      message: isArabic 
        ? "تم إرسال ملخص حجزك بنجاح" 
        : "Your booking summary has been sent successfully",
    });
  } catch (error) {
    console.error("Summary email error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send summary", details: error.message },
      { status: 500 }
    );
  }
}

function generateEmailHTML(userInfo, displayData, isArabic) {
  const dir = isArabic ? "rtl" : "ltr";
  const align = isArabic ? "right" : "left";
  const lang = isArabic ? "ar" : "en";
  
  const t = (ar, en) => isArabic ? ar : en;

  return `
<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: 'Segoe UI', Tahoma, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%); padding: 50px 40px; text-align: center;">
              <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                ${t("ملخص الحجز", "Booking Summary")}
              </h1>
              <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">
                ${t("تفاصيل حجزك مع كويك إير", "Your booking details with QuickAir")}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Personal Info Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f0fdfa 0%, #f0fdf4 100%); border-radius: 12px; padding: 24px; border-${isArabic ? 'right' : 'left'}: 4px solid #14b8a6;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #0f766e; text-align: ${align};">
                      ${t("المعلومات الشخصية", "Personal Information")}
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${generateInfoRow(t("الاسم", "Name"), userInfo.name, align)}
                      ${generateInfoRow(t("البريد الإلكتروني", "Email"), userInfo.email, align, true)}
                      ${generateInfoRow(t("رقم الهاتف", "Phone"), userInfo.phone, align)}
                      ${generateInfoRow(t("اللغة المفضلة", "Preferred Language"), userInfo.preferredLanguage === "ar" ? "العربية" : "English", align)}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Trip Details Section -->
              ${displayData.destination ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border-radius: 12px; padding: 24px; border-${isArabic ? 'right' : 'left'}: 4px solid #3b82f6;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1d4ed8; text-align: ${align};">
                      ${t("تفاصيل الرحلة", "Trip Details")}
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${displayData.destination ? generateInfoRow(t("الوجهة", "Destination"), displayData.destination, align) : ""}
                      ${displayData.dates ? generateInfoRow(t("التاريخ", "Dates"), displayData.dates, align) : ""}
                      ${displayData.travelers ? generateInfoRow(t("المسافرون", "Travelers"), displayData.travelers, align) : ""}
                      ${displayData.budget ? generateInfoRow(t("الميزانية", "Budget"), displayData.budget, align) : ""}
                    </table>
                  </td>
                </tr>
              </table>
              ` : ""}

              <!-- Hotel Details Section -->
              ${displayData.hotel ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%); border-radius: 12px; padding: 24px; border-${isArabic ? 'right' : 'left'}: 4px solid #f59e0b;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #b45309; text-align: ${align};">
                      ${t("تفاصيل الفندق", "Hotel Details")}
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${displayData.hotel ? generateInfoRow(t("الفندق", "Hotel"), displayData.hotel, align) : ""}
                      ${displayData.roomType ? generateInfoRow(t("نوع الغرفة", "Room Type"), displayData.roomType, align) : ""}
                      ${displayData.mealPlan ? generateInfoRow(t("الوجبات", "Meal Plan"), displayData.mealPlan, align) : ""}
                    </table>
                  </td>
                </tr>
              </table>
              ` : ""}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://quickair.com"}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      ${t("زيارة الموقع", "Visit Website")}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #475569; font-weight: 500;">
                ${t("شكراً لاختيارك كويك إير", "Thank you for choosing QuickAir")}
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
                ${t("سنتواصل معك قريباً لإتمام حجزك", "We'll contact you soon to complete your booking")}
              </p>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                ${process.env.CONTACT_PHONE || "+966 XX XXX XXXX"} | ${process.env.CONTACT_EMAIL || "info@quickair.com"}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function generateInfoRow(label, value, align, isEmail = false) {
  if (!value) return "";
  
  const valueContent = isEmail 
    ? `<a href="mailto:${value}" style="color: #0d9488; text-decoration: none;">${value}</a>`
    : value;

  return `
    <tr>
      <td style="padding: 8px 0; text-align: ${align};">
        <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 2px;">${label}</span>
        <span style="font-size: 15px; color: #1e293b; font-weight: 500;">${valueContent}</span>
      </td>
    </tr>
  `;
}
