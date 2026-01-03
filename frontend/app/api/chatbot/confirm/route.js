import nodemailer from "nodemailer";

/**
 * Booking Confirmation API
 * إرسال تأكيد الحجز للفريق والعميل
 * Send booking confirmation to team and customer
 */

export async function POST(request) {
  try {
    const { userInfo, tripData, language = "ar" } = await request.json();

    const isArabic = language === "ar";

    // Log booking data to console (for development)
    console.log("=".repeat(60));
    console.log("📧 NEW BOOKING REQUEST");
    console.log("=".repeat(60));
    console.log("Customer:", userInfo);
    console.log("Trip:", tripData);
    console.log("Language:", language);
    console.log("=".repeat(60));

    // For now, skip email sending if Gmail not configured
    const gmailConfigured =
      process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD;

    if (gmailConfigured) {
      // إعداد transporter للإيميل
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // بناء محتوى الإيميل للفريق
      const teamEmailContent = buildTeamEmail(userInfo, tripData, language);

      // بناء محتوى الإيميل للعميل
      const customerEmailContent = buildCustomerEmail(
        userInfo,
        tripData,
        language
      );

      // إرسال إيميل للفريق
      await transporter.sendMail({
        from: `"QuickAir Chatbot" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
        subject: isArabic
          ? `🎯 حجز جديد من ${userInfo.name}`
          : `🎯 New Booking from ${userInfo.name}`,
        html: teamEmailContent,
      });

      // إرسال إيميل للعميل
      await transporter.sendMail({
        from: `"QuickAir" <${process.env.GMAIL_USER}>`,
        to: userInfo.email,
        subject: isArabic
          ? "تأكيد طلب حجزك - QuickAir"
          : "Booking Request Confirmation - QuickAir",
        html: customerEmailContent,
      });

      console.log("✅ Emails sent successfully");
    } else {
      console.log("⚠️  Gmail not configured - Booking saved to console only");
      console.log("💡 To enable emails, add GMAIL_USER and GMAIL_APP_PASSWORD to .env file");
    }

    // إرسال إشعار واتساب (اختياري - يحتاج WhatsApp Business API)
    // await sendWhatsAppNotification(userInfo, tripData);

    return Response.json({
      success: true,
      message: isArabic
        ? "تم إرسال طلب الحجز بنجاح! سيتواصل معك فريقنا قريباً."
        : "Booking request sent successfully! Our team will contact you soon.",
    });
  } catch (error) {
    console.error("Booking confirmation error:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to send booking confirmation",
      },
      { status: 500 }
    );
  }
}

/**
 * بناء محتوى إيميل الفريق - Team Email
 */
function buildTeamEmail(userInfo, tripData, language) {
  const isArabic = language === "ar";

  return `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #019fb1 0%, #018090 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .section { margin-bottom: 25px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .section-title { font-size: 16px; font-weight: 700; color: #019fb1; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #6b7280; }
    .value { font-weight: 500; color: #1f2937; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; }
    .priority { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">🎯 ${
        isArabic ? "حجز جديد من الشات بوت" : "New Chatbot Booking"
      }</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">${new Date().toLocaleString(
        isArabic ? "ar-EG" : "en-US"
      )}</p>
    </div>

    <div class="content">
      <div class="priority">
        <strong>⚡ ${isArabic ? "إجراء مطلوب:" : "Action Required:"}</strong>
        ${
          isArabic
            ? "التواصل مع العميل في أقرب وقت"
            : "Contact customer as soon as possible"
        }
      </div>

      <!-- Personal Info -->
      <div class="section">
        <div class="section-title">
          👤 ${isArabic ? "معلومات العميل" : "Customer Information"}
        </div>
        <div class="detail-row">
          <span class="label">${isArabic ? "الاسم:" : "Name:"}</span>
          <span class="value">${userInfo.name}</span>
        </div>
        <div class="detail-row">
          <span class="label">${isArabic ? "البريد:" : "Email:"}</span>
          <span class="value"><a href="mailto:${userInfo.email}">${
    userInfo.email
  }</a></span>
        </div>
        <div class="detail-row">
          <span class="label">${isArabic ? "الهاتف:" : "Phone:"}</span>
          <span class="value"><a href="tel:${userInfo.phone}">${
    userInfo.phone
  }</a></span>
        </div>
        <div class="detail-row">
          <span class="label">${
            isArabic ? "اللغة المفضلة:" : "Preferred Language:"
          }</span>
          <span class="value">${
            userInfo.preferredLanguage === "ar" ? "العربية" : "English"
          }</span>
        </div>
      </div>

      <!-- Trip Details -->
      <div class="section">
        <div class="section-title">
          ✈️ ${isArabic ? "تفاصيل الرحلة" : "Trip Details"}
        </div>
        ${
          tripData.destination
            ? `
          <div class="detail-row">
            <span class="label">${isArabic ? "الوجهة:" : "Destination:"}</span>
            <span class="value">${
              tripData.destination.name || tripData.destination
            }</span>
          </div>
        `
            : ""
        }
        ${
          tripData.dates
            ? `
          <div class="detail-row">
            <span class="label">${isArabic ? "من:" : "From:"}</span>
            <span class="value">${tripData.dates.startDate}</span>
          </div>
          <div class="detail-row">
            <span class="label">${isArabic ? "إلى:" : "To:"}</span>
            <span class="value">${tripData.dates.endDate}</span>
          </div>
          <div class="detail-row">
            <span class="label">${isArabic ? "المدة:" : "Duration:"}</span>
            <span class="value">${tripData.dates.nights} ${
                isArabic ? "ليالي" : "nights"
              }</span>
          </div>
        `
            : ""
        }
        ${
          tripData.travelers
            ? `
          <div class="detail-row">
            <span class="label">${isArabic ? "المسافرون:" : "Travelers:"}</span>
            <span class="value">
              ${tripData.travelers.adults} ${isArabic ? "بالغ" : "adult(s)"}
              ${
                tripData.travelers.children > 0
                  ? `+ ${tripData.travelers.children} ${
                      isArabic ? "طفل" : "child(ren)"
                    }`
                  : ""
              }
            </span>
          </div>
        `
            : ""
        }
      </div>

      <!-- Hotel Info -->
      ${
        tripData.hotel
          ? `
        <div class="section">
          <div class="section-title">
            🏨 ${isArabic ? "الفندق" : "Hotel"}
          </div>
          <div class="detail-row">
            <span class="label">${isArabic ? "الفندق:" : "Hotel:"}</span>
            <span class="value">${
              isArabic
                ? tripData.hotel.hotel_name_ar
                : tripData.hotel.hotel_name_en
            } ${"⭐".repeat(tripData.hotel.stars || 4)}</span>
          </div>
          ${
            tripData.mealPlan
              ? `
            <div class="detail-row">
              <span class="label">${isArabic ? "الوجبات:" : "Meals:"}</span>
              <span class="value">${tripData.mealPlan.label}</span>
            </div>
          `
              : ""
          }
          ${
            tripData.roomType
              ? `
            <div class="detail-row">
              <span class="label">${isArabic ? "الغرفة:" : "Room:"}</span>
              <span class="value">${tripData.roomType.label}</span>
            </div>
          `
              : ""
          }
          <div class="detail-row">
            <span class="label">${isArabic ? "السعر:" : "Price:"}</span>
            <span class="value" style="color: #019fb1; font-weight: 700;">
              ${tripData.hotel.price_egp?.toLocaleString()} ${
              isArabic ? "ج.م" : "EGP"
            } ($${tripData.hotel.price_usd_reference})
            </span>
          </div>
        </div>
      `
          : ""
      }

      <!-- Budget -->
      ${
        tripData.budget
          ? `
        <div class="section">
          <div class="section-title">
            💰 ${isArabic ? "الميزانية" : "Budget"}
          </div>
          <div class="detail-row">
            <span class="label">${isArabic ? "النطاق:" : "Range:"}</span>
            <span class="value">${tripData.budget.label}</span>
          </div>
        </div>
      `
          : ""
      }
    </div>

    <div class="footer">
      <p style="margin: 0;">QuickAir Chatbot System</p>
      <p style="margin: 5px 0 0 0;">${
        isArabic ? "نظام الحجز الذكي" : "Smart Booking System"
      }</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * بناء محتوى إيميل العميل - Customer Email
 */
function buildCustomerEmail(userInfo, tripData, language) {
  const isArabic = language === "ar";

  return `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #019fb1 0%, #018090 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; }
    .section { margin-bottom: 20px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .section-title { font-size: 16px; font-weight: 700; color: #019fb1; margin-bottom: 15px; }
    .detail-row { padding: 8px 0; }
    .label { font-weight: 600; color: #6b7280; display: block; margin-bottom: 4px; }
    .value { font-weight: 500; color: #1f2937; }
    .success-box { background: #d1fae5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center; }
    .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 26px;">✈️ QuickAir</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">
        ${isArabic ? "تأكيد طلب الحجز" : "Booking Request Confirmation"}
      </p>
    </div>

    <div class="content">
      <div class="success-box">
        <h2 style="margin: 0 0 10px 0; color: #10b981; font-size: 22px;">✅ ${
          isArabic ? "تم استلام طلبك!" : "Request Received!"
        }</h2>
        <p style="margin: 0; color: #059669; font-size: 15px;">
          ${
            isArabic
              ? "سيتواصل معك فريقنا خلال 24 ساعة لإتمام الحجز"
              : "Our team will contact you within 24 hours to complete the booking"
          }
        </p>
      </div>

      <p style="font-size: 15px; color: #374151; line-height: 1.6;">
        ${
          isArabic ? `عزيزي/عزيزتي ${userInfo.name}،` : `Dear ${userInfo.name},`
        }
      </p>
      <p style="font-size: 15px; color: #374151; line-height: 1.6;">
        ${
          isArabic
            ? "شكراً لاستخدامك مساعدنا الذكي. تم استلام طلب حجزك وإليك ملخص رحلتك:"
            : "Thank you for using our AI assistant. We have received your booking request. Here's your trip summary:"
        }
      </p>

      <!-- Trip Summary -->
      ${
        tripData.destination
          ? `
        <div class="section">
          <div class="section-title">📍 ${
            isArabic ? "تفاصيل الرحلة" : "Trip Details"
          }</div>
          <div class="detail-row">
            <span class="label">${isArabic ? "الوجهة" : "Destination"}</span>
            <span class="value">${
              tripData.destination.name || tripData.destination
            }</span>
          </div>
          ${
            tripData.dates
              ? `
            <div class="detail-row">
              <span class="label">${isArabic ? "التواريخ" : "Dates"}</span>
              <span class="value">${tripData.dates.startDate} - ${
                  tripData.dates.endDate
                } (${tripData.dates.nights} ${
                  isArabic ? "ليالي" : "nights"
                })</span>
            </div>
          `
              : ""
          }
          ${
            tripData.travelers
              ? `
            <div class="detail-row">
              <span class="label">${
                isArabic ? "عدد المسافرين" : "Number of Travelers"
              }</span>
              <span class="value">${tripData.travelers.total} ${
                  isArabic ? "مسافر" : "traveler(s)"
                }</span>
            </div>
          `
              : ""
          }
        </div>
      `
          : ""
      }

      ${
        tripData.hotel
          ? `
        <div class="section">
          <div class="section-title">🏨 ${
            isArabic ? "الفندق المختار" : "Selected Hotel"
          }</div>
          <div class="detail-row">
            <span class="label">${isArabic ? "الفندق" : "Hotel"}</span>
            <span class="value">${
              isArabic
                ? tripData.hotel.hotel_name_ar
                : tripData.hotel.hotel_name_en
            } ${"⭐".repeat(tripData.hotel.stars || 4)}</span>
          </div>
          ${
            tripData.mealPlan
              ? `
            <div class="detail-row">
              <span class="label">${
                isArabic ? "نظام الوجبات" : "Meal Plan"
              }</span>
              <span class="value">${tripData.mealPlan.label}</span>
            </div>
          `
              : ""
          }
          ${
            tripData.roomType
              ? `
            <div class="detail-row">
              <span class="label">${
                isArabic ? "نوع الغرفة" : "Room Type"
              }</span>
              <span class="value">${tripData.roomType.label}</span>
            </div>
          `
              : ""
          }
        </div>
      `
          : ""
      }

      <p style="font-size: 14px; color: #6b7280; line-height: 1.6; margin-top: 25px;">
        ${
          isArabic
            ? 'للتواصل معنا: ${process.env.CONTACT_PHONE || "+966 XX XXX XXXX"}'
            : 'Contact us: ${process.env.CONTACT_PHONE || "+966 XX XXX XXXX"}'
        }
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0; font-weight: 600;">QuickAir</p>
      <p style="margin: 5px 0 0 0;">${
        isArabic ? "رحلات لا تُنسى" : "Unforgettable Journeys"
      }</p>
    </div>
  </div>
</body>
</html>
  `;
}
