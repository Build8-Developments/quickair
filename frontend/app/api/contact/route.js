import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate input
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: true, // true for port 465 (SSL)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
      logger: true,
    });

    // Verify connection
    try {
      await transporter.verify();
      console.log("SMTP connection verified successfully");
    } catch (verifyError) {
      console.error("SMTP verification failed:", verifyError);
      throw new Error(`SMTP connection failed: ${verifyError.message}`);
    }

    // Email to company
    const mailOptionsToCompany = {
      from: `"QuickAir" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `رسالة جديدة من ${name}`,
      html: buildCompanyEmail(name, email, phone, message),
    };

    // Auto-reply email to customer
    const mailOptionsToCustomer = {
      from: `"QuickAir" <${process.env.SMTP_USER}>`,
      to: email,
      replyTo: process.env.SMTP_USER,
      subject: "شكراً لتواصلك معنا - QuickAir",
      html: buildCustomerEmail(name, message),
    };

    // Send both emails
    await transporter.sendMail(mailOptionsToCompany);
    await transporter.sendMail(mailOptionsToCustomer);

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

function buildCompanyEmail(name, email, phone, message) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
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
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">رسالة جديدة</h1>
              <p style="margin: 12px 0 0 0; font-size: 15px; color: rgba(255, 255, 255, 0.9);">من نموذج التواصل</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Priority Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background: #fef3c7; border-radius: 10px; padding: 16px 20px; border-right: 4px solid #f59e0b;">
                    <p style="margin: 0; font-size: 14px; color: #92400e;">
                      <strong>إجراء مطلوب:</strong> الرد على العميل في أقرب وقت
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Customer Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f0fdfa 0%, #f0fdf4 100%); border-radius: 12px; padding: 24px; border-right: 4px solid #14b8a6;">
                    <h2 style="margin: 0 0 20px 0; font-size: 17px; font-weight: 600; color: #0f766e; text-align: right;">
                      معلومات العميل
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #d1fae5; text-align: right;">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">الاسم</span>
                          <span style="font-size: 15px; color: #1e293b; font-weight: 600;">${name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #d1fae5; text-align: right;">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">البريد الإلكتروني</span>
                          <a href="mailto:${email}" style="font-size: 15px; color: #0d9488; font-weight: 600; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; text-align: right;">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 4px;">رقم الهاتف</span>
                          <a href="tel:${phone}" style="font-size: 15px; color: #0d9488; font-weight: 600; text-decoration: none;">${phone}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background: #f8fafc; border-radius: 12px; padding: 24px; border-right: 4px solid #64748b;">
                    <h2 style="margin: 0 0 16px 0; font-size: 17px; font-weight: 600; color: #475569; text-align: right;">
                      الرسالة
                    </h2>
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.8; text-align: right;">
                        ${message.replace(/\n/g, "<br>")}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #64748b;">
                ${new Date().toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' })}
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

function buildCustomerEmail(name, message) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
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
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">QuickAir</h1>
              <p style="margin: 12px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">شكراً لتواصلك معنا</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Success Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #6ee7b7;">
                    <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #065f46;">تم استلام رسالتك بنجاح</h2>
                    <p style="margin: 0; font-size: 14px; color: #047857;">سيتواصل معك فريقنا في أقرب وقت ممكن</p>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="font-size: 16px; color: #1e293b; line-height: 1.7; margin: 0 0 20px 0; text-align: right;">
                عزيزي ${name}،
              </p>
              <p style="font-size: 15px; color: #475569; line-height: 1.8; margin: 0 0 30px 0; text-align: right;">
                شكراً لتواصلك مع QuickAir. لقد استلمنا رسالتك وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.
              </p>

              <!-- Message Copy -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background: #f8fafc; border-radius: 12px; padding: 24px; border-right: 4px solid #14b8a6;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #0f766e; text-align: right;">رسالتك:</p>
                    <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                      <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.7; font-style: italic; text-align: right;">
                        ${message.replace(/\n/g, "<br>")}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="font-size: 15px; color: #475569; line-height: 1.8; margin: 0 0 30px 0; text-align: right;">
                في هذه الأثناء، يمكنك استكشاف موقعنا لمعرفة المزيد عن خدماتنا وعروض السفر المميزة.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://quickair.com"}" 
                       style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 15px; font-weight: 600;">
                      زيارة الموقع
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 16px 0; font-size: 14px; font-weight: 600; color: #374151;">للتواصل معنا</p>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">البريد الإلكتروني: 19102@quickair.travel</p>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">الهاتف: 19102</p>
              <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">ساعات العمل: السبت - الخميس، 9 صباحاً - 6 مساءً</p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                هذه رسالة تلقائية، يرجى عدم الرد على هذا البريد الإلكتروني.
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
