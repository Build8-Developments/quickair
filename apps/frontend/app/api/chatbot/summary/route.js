import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { userInfo, tripData, messages, language } = await request.json();
    const isArabic = language === "ar";

    // Log summary to console (for development)
    console.log("=".repeat(60));
    console.log("📊 TRIP SUMMARY REQUEST");
    console.log("=".repeat(60));
    console.log("Customer:", userInfo);
    console.log("Trip:", tripData);
    console.log("Messages:", messages?.length || 0, "messages");
    console.log("Language:", language);
    console.log("=".repeat(60));

    // Check if SMTP is configured
    const smtpConfigured = process.env.GMAIL_USER && 
                          process.env.GMAIL_APP_PASSWORD;

    if (smtpConfigured) {
      // Create email transporter using Gmail
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

    // Generate email content
    const emailSubject = isArabic
      ? `ملخص رحلتك مع QuickAir - ${userInfo.name}`
      : `Your QuickAir Trip Summary - ${userInfo.name}`;

    const emailHTML = `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}" lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #019fb1 0%, #01c0d4 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 40px 30px;
    }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
    }
    .section h2 {
      color: #019fb1;
      margin-top: 0;
      font-size: 20px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 12px;
    }
    .info-row {
      margin: 12px 0;
      font-size: 15px;
      color: #475569;
      line-height: 1.8;
    }
    .info-row strong {
      color: #0f172a;
    }
    .message {
      margin: 12px 0;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      line-height: 1.6;
    }
    .user-message {
      background: linear-gradient(135deg, #019fb1 0%, #01c0d4 100%);
      color: white;
      text-align: ${isArabic ? "right" : "left"};
    }
    .bot-message {
      background: white;
      border: 2px solid #e2e8f0;
      color: #1e293b;
      text-align: ${isArabic ? "right" : "left"};
    }
    .footer {
      text-align: center;
      padding: 30px;
      background: #f1f5f9;
      color: #64748b;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #019fb1 0%, #01c0d4 100%);
      color: white;
      text-decoration: none;
      border-radius: 10px;
      margin-top: 20px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✈️ ${isArabic ? "ملخص رحلتك" : "Your Trip Summary"}</h1>
      <p>${isArabic ? "تفاصيل رحلتك مع QuickAir" : "Your trip details with QuickAir"}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>👤 ${isArabic ? "المعلومات الشخصية" : "Personal Information"}</h2>
        <div class="info-row"><strong>${isArabic ? "الاسم:" : "Name:"}</strong> ${userInfo.name}</div>
        <div class="info-row"><strong>${isArabic ? "البريد الإلكتروني:" : "Email:"}</strong> ${userInfo.email}</div>
        <div class="info-row"><strong>${isArabic ? "رقم الهاتف:" : "Phone:"}</strong> ${userInfo.phone}</div>
        <div class="info-row"><strong>${isArabic ? "اللغة المفضلة:" : "Preferred Language:"}</strong> ${userInfo.preferredLanguage === "ar" ? "العربية" : "English"}</div>
      </div>

      ${
        tripData.destination
          ? `
      <div class="section">
        <h2>🗺️ ${isArabic ? "تفاصيل الرحلة" : "Trip Details"}</h2>
        ${tripData.destination ? `<div class="info-row"><strong>📍 ${isArabic ? "الوجهة:" : "Destination:"}</strong> ${tripData.destination}</div>` : ""}
        ${tripData.duration ? `<div class="info-row"><strong>📅 ${isArabic ? "المدة:" : "Duration:"}</strong> ${tripData.duration}</div>` : ""}
        ${tripData.budget ? `<div class="info-row"><strong>💰 ${isArabic ? "الميزانية:" : "Budget:"}</strong> ${tripData.budget}</div>` : ""}
        ${tripData.travelers ? `<div class="info-row"><strong>👥 ${isArabic ? "عدد المسافرين:" : "Travelers:"}</strong> ${tripData.travelers}</div>` : ""}
        ${tripData.preferences && tripData.preferences.length > 0 ? `<div class="info-row"><strong>❤️ ${isArabic ? "التفضيلات:" : "Preferences:"}</strong> ${tripData.preferences.join(", ")}</div>` : ""}
      </div>
      `
          : ""
      }

      ${
        messages && messages.length > 0
          ? `
      <div class="section">
        <h2>💬 ${isArabic ? "محادثتك معنا" : "Your Conversation"}</h2>
        ${messages
          .map((msg) => {
            const isUser = msg.role === "user";
            return `<div class="message ${isUser ? "user-message" : "bot-message"}">${msg.content}</div>`;
          })
          .join("")}
      </div>
      `
          : ""
      }

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://quickair.com"}" class="cta-button">
          ${isArabic ? "زيارة الموقع" : "Visit Website"}
        </a>
      </div>
    </div>

    <div class="footer">
      <p>${isArabic ? "شكراً لاختيارك QuickAir" : "Thank you for choosing QuickAir"}</p>
      <p>${isArabic ? "سنتواصل معك قريباً لإتمام حجزك" : "We'll contact you soon to complete your booking"}</p>
      <p style="margin-top: 20px;">
        ${isArabic ? "تواصل معنا:" : "Contact us:"}<br>
        📞 ${process.env.CONTACT_PHONE || "+966 XX XXX XXXX"}<br>
        📧 ${process.env.CONTACT_EMAIL || "info@quickair.com"}
      </p>
    </div>
  </div>
</body>
</html>
    `;

      // Send email to user
      await transporter.sendMail({
        from: `"QuickAir" <${process.env.GMAIL_USER}>`,
        to: userInfo.email,
        subject: emailSubject,
        html: emailHTML,
      });

      // Send notification to admin
      await transporter.sendMail({
        from: `"QuickAir Chatbot" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
        subject: `New Trip Request - ${userInfo.name}`,
        html: emailHTML,
      });

      console.log("✅ Summary emails sent successfully");
    } else {
      console.log("⚠️  SMTP not configured - Summary saved to console only");
      console.log("💡 To enable emails, add GMAIL_USER and GMAIL_APP_PASSWORD to .env file");
    }

    return NextResponse.json({
      success: true,
      message: isArabic 
        ? "تم حفظ ملخص رحلتك بنجاح" 
        : "Your trip summary has been saved successfully",
    });
  } catch (error) {
    console.error("Summary email error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send summary",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
