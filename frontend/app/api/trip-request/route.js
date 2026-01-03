import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const tripData = await request.json();

    console.log("Trip request received:", tripData);

    // Generate unique request ID
    const requestId = `TRIP-${Date.now()}`;

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Format trip data for email
    const formatTripData = (data) => {
      const {
        destination,
        tripType,
        locationType,
        hotel,
        travelers,
        dates,
        budget,
        visa,
        preferences,
      } = data;

      const formatDate = (date) => {
        if (!date) return "Not specified";
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };

      const getTotalTravelers = () => {
        const { adults = 0, children = 0, infants = 0 } = travelers || {};
        return adults + children + infants;
      };

      const CURRENCY_SYMBOLS = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        AED: "AED",
        EGP: "ج.م",
      };

      return `
        <h2 style="color: #019fb1; border-bottom: 2px solid #019fb1; padding-bottom: 10px;">Trip Overview</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 180px;">Request ID:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${requestId}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Trip Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
              tripType?.title || "Not specified"
            }</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Destination:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
              destination?.name || "Not specified"
            }</td>
          </tr>
          ${
            locationType
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Location Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
              locationType.title || locationType
            }</td>
          </tr>`
              : ""
          }
          ${
            hotel
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Hotel:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
              hotel.name || "Not specified"
            }</td>
          </tr>`
              : ""
          }
        </table>

        <h2 style="color: #019fb1; border-bottom: 2px solid #019fb1; padding-bottom: 10px;">Travelers & Dates</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 180px;">Total Travelers:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${getTotalTravelers()} people</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Adults:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
              travelers?.adults || 0
            }</td>
          </tr>
          ${
            (travelers?.children || 0) > 0
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Children:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${travelers.children}</td>
          </tr>`
              : ""
          }
          ${
            (travelers?.infants || 0) > 0
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Infants:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${travelers.infants}</td>
          </tr>`
              : ""
          }
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Dates:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${
                dates?.flexible
                  ? "Flexible dates"
                  : `${formatDate(dates?.startDate)} - ${formatDate(
                      dates?.endDate
                    )}`
              }
            </td>
          </tr>
        </table>

        <h2 style="color: #019fb1; border-bottom: 2px solid #019fb1; padding-bottom: 10px;">Budget</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 180px;">Budget Amount:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #019fb1; font-size: 18px;">
              ${CURRENCY_SYMBOLS[budget?.currency] || "$"}${
        budget?.amount
          ? Number(budget.amount).toLocaleString()
          : "Not specified"
      }
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Budget Type:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${budget?.perPerson ? "Per person" : "Total trip budget"}
            </td>
          </tr>
        </table>

        <h2 style="color: #019fb1; border-bottom: 2px solid #019fb1; padding-bottom: 10px;">Visa Requirements</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 180px;">Visa Needed:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">
              ${
                visa?.needed === true
                  ? "Yes"
                  : visa?.needed === false
                  ? "No"
                  : "Not specified"
              }
            </td>
          </tr>
          ${
            visa?.needed === true
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Has Visa:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
              visa.hasVisa ? "Yes" : "No"
            }</td>
          </tr>
          ${
            visa.hasVisa === false
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Assistance Required:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
              visa.assistanceRequired ? "Yes" : "No"
            }</td>
          </tr>`
              : ""
          }`
              : ""
          }
        </table>

        ${
          preferences?.accommodation?.length > 0 ||
          preferences?.activities?.length > 0 ||
          preferences?.mealPlan ||
          preferences?.specialRequests
            ? `
        <h2 style="color: #019fb1; border-bottom: 2px solid #019fb1; padding-bottom: 10px;">Preferences</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          ${
            preferences?.accommodation?.length > 0
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 180px;">Accommodation:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${preferences.accommodation.join(
              ", "
            )}</td>
          </tr>`
              : ""
          }
          ${
            preferences?.activities?.length > 0
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Activities:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${preferences.activities.join(
              ", "
            )}</td>
          </tr>`
              : ""
          }
          ${
            preferences?.mealPlan
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Meal Plan:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${preferences.mealPlan}</td>
          </tr>`
              : ""
          }
          ${
            preferences?.specialRequests
              ? `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Special Requests:</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${preferences.specialRequests}</td>
          </tr>`
              : ""
          }
        </table>`
            : ""
        }
      `;
    };

    // Email to company
    const mailOptionsToCompany = {
      from: `"QuickAir Trip Request" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      subject: `New Trip Request: ${
        tripData.destination?.name || "Custom Trip"
      } - ${requestId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #019fb1 0%, #016d7a 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Trip Request Received</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #019fb1; border-bottom: 2px solid #019fb1; padding-bottom: 10px;">Customer Contact</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 180px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
                  tripData.contact?.name || "Not provided"
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
                  tripData.contact?.email || "Not provided"
                }</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${
                  tripData.contact?.phone || "Not provided"
                }</td>
              </tr>
            </table>
            ${formatTripData(tripData)}
            <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
              Request submitted on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    // Email to customer
    const mailOptionsToCustomer = {
      from: `"QuickAir" <${process.env.GMAIL_USER}>`,
      to: tripData.contact?.email,
      subject: `Trip Request Confirmation - ${requestId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #019fb1 0%, #016d7a 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You for Your Trip Request!</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="color: #333; font-size: 16px;">Dear ${
              tripData.contact?.name || "Valued Customer"
            },</p>
            <p style="color: #333; line-height: 1.6;">
              Thank you for choosing QuickAir! We have received your trip request and our travel experts are already working on creating the perfect itinerary for you.
            </p>
            <div style="background-color: white; padding: 20px; border-left: 4px solid #019fb1; margin: 20px 0; border-radius: 8px;">
              <p style="color: #666; margin: 0; font-size: 14px;">Your Request ID:</p>
              <p style="color: #019fb1; margin: 5px 0 0 0; font-weight: bold; font-size: 20px;">${requestId}</p>
            </div>
            
            ${formatTripData(tripData)}
            
            <div style="background-color: #e8f8fa; padding: 25px; border-radius: 8px; margin: 30px 0;">
              <h3 style="color: #019fb1; margin-top: 0;">What Happens Next?</h3>
              <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
                <li>Our travel experts will review your requirements</li>
                <li>We'll create a personalized itinerary with the best options</li>
                <li>You'll receive a detailed proposal within 24 hours</li>
                <li>We'll work together to perfect your dream trip</li>
              </ul>
            </div>

            <p style="color: #333; line-height: 1.6;">
              If you have any questions or need to make changes to your request, please don't hesitate to contact us.
            </p>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${
                process.env.NEXT_PUBLIC_SITE_URL || "https://quickair.com"
              }" 
                 style="background-color: #019fb1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
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
              This is an automated confirmation. Please keep this email for your records.
            </p>
          </div>
        </div>
      `,
    };

    // Send emails to both company and customer
    try {
      console.log(
        "Sending email to company:",
        process.env.CONTACT_EMAIL || process.env.GMAIL_USER
      );
      await transporter.sendMail(mailOptionsToCompany);
      console.log("✓ Email sent to company successfully");

      if (tripData.contact?.email) {
        console.log(
          "Sending confirmation email to customer:",
          tripData.contact.email
        );
        await transporter.sendMail(mailOptionsToCustomer);
        console.log("✓ Confirmation email sent to customer successfully");
      }
    } catch (emailError) {
      console.error("Error sending emails:", emailError);
      // Continue anyway - don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Trip request received successfully",
        requestId: requestId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing trip request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process trip request",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
