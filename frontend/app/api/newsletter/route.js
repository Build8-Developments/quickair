import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email, language = "en" } = await request.json();
    const isArabic = language === "ar";

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: isArabic ? "البريد الإلكتروني مطلوب" : "Email is required" },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: isArabic ? "عنوان بريد إلكتروني غير صالح" : "Invalid email address" },
        { status: 400 }
      );
    }

    // Create transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to company (notification of new subscriber)
    const mailOptionsToCompany = {
      from: `"QuickAir Newsletter" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: isArabic ? `اشتراك جديد في النشرة البريدية` : `New Newsletter Subscription`,
      html: buildCompanyNotificationEmail(email, isArabic),
    };

    // Welcome email to subscriber
    const mailOptionsToSubscriber = {
      from: `"QuickAir" <${process.env.SMTP_USER}>`,
      to: email,
      subject: isArabic ? "مرحباً بك في نشرة QuickAir!" : "Welcome to QuickAir Newsletter!",
      html: buildSubscriberWelcomeEmail(email, isArabic),
    };

    // Send both emails
    await transporter.sendMail(mailOptionsToCompany);
    await transporter.sendMail(mailOptionsToSubscriber);

    return NextResponse.json(
      {
        success: true,
        message: isArabic ? "تم الاشتراك في النشرة البريدية بنجاح" : "Successfully subscribed to newsletter",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to subscribe. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// Company notification email
function buildCompanyNotificationEmail(email, isArabic) {
  const t = (ar, en) => isArabic ? ar : en;
  const dir = isArabic ? "rtl" : "ltr";
  const lang = isArabic ? "ar" : "en";
  const align = isArabic ? "right" : "left";
  const borderSide = isArabic ? "border-right" : "border-left";
  const dateLocale = isArabic ? 'ar-EG' : 'en-US';

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
            <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">${t("اشتراك جديد", "New Subscription")}</h1>
              <p style="margin: 12px 0 0 0; font-size: 15px; color: rgba(255, 255, 255, 0.9);">${t("النشرة البريدية", "Newsletter")}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #f0fdfa 0%, #f0fdf4 100%); border-radius: 12px; padding: 24px; ${borderSide}: 4px solid #14b8a6;">
                    <h2 style="margin: 0 0 20px 0; font-size: 17px; font-weight: 600; color: #0f766e; text-align: ${align};">
                      ${t("معلومات المشترك", "Subscriber Information")}
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #d1fae5; text-align: ${align};">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">${t("البريد الإلكتروني", "Email")}</span>
                          <a href="mailto:${email}" style="font-size: 15px; color: #0d9488; font-weight: 600; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; text-align: ${align};">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">${t("التاريخ", "Date")}</span>
                          <span style="font-size: 15px; color: #1e293b; font-weight: 600;">${new Date().toLocaleString(dateLocale)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                ${t("تم الإرسال من نموذج الاشتراك في النشرة البريدية", "Sent from QuickAir newsletter subscription form")}
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

// Subscriber welcome email
function buildSubscriberWelcomeEmail(email, isArabic) {
  const t = (ar, en) => isArabic ? ar : en;
  const dir = isArabic ? "rtl" : "ltr";
  const lang = isArabic ? "ar" : "en";
  const align = isArabic ? "right" : "left";

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
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">${t("مرحباً بك في QuickAir!", "Welcome to QuickAir!")}</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Success Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #6ee7b7;">
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #065f46;">${t("شكراً لاشتراكك!", "Thank You for Subscribing!")}</h2>
                    <p style="margin: 0; font-size: 14px; color: #047857;">${t("تم تسجيلك بنجاح في نشرتنا البريدية", "You've successfully subscribed to our newsletter")}</p>
                  </td>
                </tr>
              </table>

              <p style="font-size: 15px; color: #475569; line-height: 1.8; margin: 0 0 30px 0; text-align: ${align};">
                ${t(
                  "نحن سعداء بانضمامك إلينا! ستتلقى أحدث العروض والأخبار مباشرة في بريدك الإلكتروني.",
                  "We're excited to have you on board! You'll receive the latest offers and news directly in your inbox."
                )}
              </p>

              <!-- What to Expect -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background: #f8fafc; border-radius: 12px; padding: 24px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 17px; font-weight: 600; color: #0f766e; text-align: ${align};">${t("ماذا تتوقع:", "What to Expect:")}</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; text-align: ${align};">
                          <span style="font-size: 14px; color: #475569;">${t("عروض سفر حصرية", "Exclusive travel deals and offers")}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; text-align: ${align};">
                          <span style="font-size: 14px; color: #475569;">${t("أحدث أخبار ونصائح السفر", "Latest travel news and tips")}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; text-align: ${align};">
                          <span style="font-size: 14px; color: #475569;">${t("وصول مبكر للعروض الخاصة", "Early access to special promotions")}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; text-align: ${align};">
                          <span style="font-size: 14px; color: #475569;">${t("أدلة الوجهات والتوصيات", "Destination guides and recommendations")}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://quickair.com"}" 
                       style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 15px; font-weight: 600;">
                      ${t("استكشف الوجهات", "Explore Destinations")}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">${t("البريد الإلكتروني:", "Email:")} 19102@quickair.travel</p>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">${t("الهاتف:", "Phone:")} 19102</p>
              <p style="margin: 20px 0 0 0; font-size: 11px; color: #94a3b8;">
                ${t(
                  "أنت تتلقى هذا البريد لأنك اشتركت في نشرة QuickAir البريدية.",
                  "You're receiving this email because you subscribed to QuickAir newsletter."
                )}
                <br>
                ${t(
                  "إذا لم تعد ترغب في تلقي هذه الرسائل، يمكنك إلغاء الاشتراك في أي وقت.",
                  "If you no longer wish to receive these emails, you can unsubscribe at any time."
                )}
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
