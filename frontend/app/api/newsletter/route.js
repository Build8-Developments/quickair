import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create transporter with App Password
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

    // Email to company (notification of new subscriber)
    const mailOptionsToCompany = {
      from: `"QuickAir Newsletter" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      subject: `New Newsletter Subscription`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Newsletter Subscriber</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">Subscriber Information</h2>
            <div style="background-color: white; padding: 20px; border-left: 4px solid #667eea; margin-top: 10px;">
              <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0 0 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
              This email was sent from the QuickAir newsletter subscription form
            </p>
          </div>
        </div>
      `,
    };

    // Welcome email to subscriber
    const mailOptionsToSubscriber = {
      from: `"QuickAir" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Welcome to QuickAir Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to QuickAir! ✈️</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">Thank You for Subscribing!</h2>
            <p style="color: #333; line-height: 1.6; font-size: 16px;">
              We're excited to have you on board! You've successfully subscribed to the QuickAir newsletter.
            </p>
            <div style="background-color: white; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #667eea; margin-top: 0;">What to Expect:</h3>
              <ul style="color: #333; line-height: 1.8;">
                <li>🌟 Exclusive travel deals and offers</li>
                <li>✈️ Latest travel news and tips</li>
                <li>🎫 Early access to special promotions</li>
                <li>🗺️ Destination guides and recommendations</li>
              </ul>
            </div>
            <p style="color: #333; line-height: 1.6;">
              Stay tuned for amazing travel opportunities and insider tips to make your journeys unforgettable!
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://quickair.com'}" 
                 style="background-color: #667eea; color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: 600;">
                Explore Destinations
              </a>
            </div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
              <p style="color: #666; margin: 5px 0;">📧 Email: 19102@quickair.travel</p>
              <p style="color: #666; margin: 5px 0;">📞 Phone: 19102</p>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">
                You're receiving this email because you subscribed to QuickAir newsletter.
                <br>
                If you no longer wish to receive these emails, you can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptionsToCompany);
    await transporter.sendMail(mailOptionsToSubscriber);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
