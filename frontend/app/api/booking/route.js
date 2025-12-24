import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const {
      fullName,
      email,
      phone,
      hotelName,
      period,
      checkInDate,
      checkOutDate,
      nights,
      adults,
      children,
      trips,
      total,
      currency,
    } = data;

    // Validate required fields
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format WhatsApp message
    let message = `*New Booking Request*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${fullName}\n`;
    message += `Email: ${email}\n`;
    message += `Phone: ${phone}\n\n`;
    message += `*Booking Details:*\n`;
    message += `Hotel: ${hotelName}\n`;
    if (period) {
      message += `Period: ${period}\n`;
    }
    if (checkInDate && checkOutDate) {
      message += `Check-in: ${checkInDate}\n`;
      message += `Check-out: ${checkOutDate}\n`;
    }
    message += `Nights: ${nights}\n`;
    message += `Adults: ${adults}\n`;
    message += `Children: ${children}\n`;

    if (trips && trips.length > 0) {
      message += `\n*Optional Trips:*\n`;
      trips.forEach((trip) => {
        message += `- ${trip}\n`;
      });
    }

    message += `\n*Total: ${total} ${currency}*`;

    // Send to Ultramsg API
    const ultramsgUrl = `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE}/messages/chat`;

    const ultramsgResponse = await fetch(ultramsgUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: process.env.ULTRAMSG_TOKEN,
        to: process.env.WHATSAPP_NOTIFY_TO,
        body: message,
        priority: 10,
      }),
    });

    const ultramsgData = await ultramsgResponse.json();

    console.log(ultramsgData);

    if (!ultramsgResponse.ok) {
      console.error("Ultramsg API error:", ultramsgData);
      return NextResponse.json(
        { error: "Failed to send booking notification" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking request sent successfully",
      data: ultramsgData,
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
