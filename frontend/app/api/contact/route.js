import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate input
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter with App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
        minVersion: 'TLSv1.2',
      },
    });

    // Email to company
    const mailOptionsToCompany = {
      from: `"QuickAir Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      html: `
<!DOCTYPE html>
<html dir="ltr" lang="en">
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
                New Contact Form Submission
              </h1>
              <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">
                A new message has been received
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Contact Info Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f0fdfa 0%, #f0fdf4 100%); border-radius: 12px; padding: 24px; border-left: 4px solid #14b8a6;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #0f766e; text-align: left;">
                      Contact Details
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; text-align: left;">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 2px;">Name</span>
                          <span style="font-size: 15px; color: #1e293b; font-weight: 500;">${name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; text-align: left;">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 2px;">Email</span>
                          <span style="font-size: 15px; color: #1e293b; font-weight: 500;"><a href="mailto:${email}" style="color: #0d9488; text-decoration: none;">${email}</a></span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; text-align: left;">
                          <span style="font-size: 13px; color: #64748b; display: block; margin-bottom: 2px;">Phone</span>
                          <span style="font-size: 15px; color: #1e293b; font-weight: 500;">${phone}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); border-radius: 12px; padding: 24px; border-left: 4px solid #3b82f6;">
                    <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #1d4ed8; text-align: left;">
                      Message
                    </h2>
                    <p style="margin: 0; font-size: 15px; color: #1e293b; line-height: 1.6;">
                      ${message.replace(/\n/g, '<br>')}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                Received on ${new Date().toLocaleString()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    // Auto-reply email to customer
    const mailOptionsToCustomer = {
      from: `"QuickAir" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting QuickAir',
      html: `
<!DOCTYPE html>
<html dir="ltr" lang="en">
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
                Thank You for Reaching Out!
              </h1>
              <p style="margin: 0; font-size: 16px; color: rgba(255, 255, 255, 0.9);">
                We've received your message
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <p style="color: #333; font-size: 16px; margin: 0 0 20px 0;">Dear ${name},</p>
              <p style="color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for contacting QuickAir. We have received your message and our team will get back to you as soon as possible.
              </p>

              <!-- Message Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f0fdfa 0%, #f0fdf4 100%); border-radius: 12px; padding: 24px; border-left: 4px solid #14b8a6;">
                    <h2 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f766e; text-align: left;">
                      Your Message
                    </h2>
                    <p style="margin: 0; font-size: 15px; color: #1e293b; line-height: 1.6; font-style: italic;">
                      ${message.replace(/\n/g, '<br>')}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                In the meantime, feel free to explore our website for more information about our services and travel packages.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://quickair.com'}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Visit Our Website
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
                Thank you for choosing QuickAir
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #64748b;">
                We'll get back to you as soon as possible
              </p>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #94a3b8;">
                📧 19102@quickair.travel | 📞 19102
              </p>
              <p style="margin: 0; font-size: 13px; color: #94a3b8;">
                🕒 Working Hours: Sat - Thu: 9 AM - 6 PM
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptionsToCompany);
    await transporter.sendMail(mailOptionsToCustomer);

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send message. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
