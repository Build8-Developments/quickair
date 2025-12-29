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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone}</td>
              </tr>
            </table>
            <h3 style="color: #333; margin-top: 30px;">Message:</h3>
            <div style="background-color: white; padding: 20px; border-left: 4px solid #667eea; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
              This email was sent from the QuickAir contact form on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply email to customer
    const mailOptionsToCustomer = {
      from: `"QuickAir" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting QuickAir',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You for Reaching Out!</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="color: #333; font-size: 16px;">Dear ${name},</p>
            <p style="color: #333; line-height: 1.6;">
              Thank you for contacting QuickAir. We have received your message and our team will get back to you as soon as possible.
            </p>
            <div style="background-color: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="color: #666; margin: 0; font-style: italic;">Your message:</p>
              <p style="color: #333; margin-top: 10px;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="color: #333; line-height: 1.6;">
              In the meantime, feel free to explore our website for more information about our services and travel packages.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://quickair.com'}" 
                 style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Visit Our Website
              </a>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; margin: 5px 0;"><strong>Contact Information:</strong></p>
              <p style="color: #666; margin: 5px 0;">📧 Email: 19102@quickair.travel</p>
              <p style="color: #666; margin: 5px 0;">📞 Phone: 19102</p>
              <p style="color: #666; margin: 5px 0;">🕒 Working Hours: Sat - Thu: 9 AM - 6 PM</p>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        </div>
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
