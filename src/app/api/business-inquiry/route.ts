import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
const getResend = () => new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.businessName || !body.contactName || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database
    const inquiry = await prisma.businessInquiry.create({
      data: {
        businessName: body.businessName,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone || null,
        projectDescription: body.projectDescription || null,
        sizesInfo: body.sizesInfo || null,
        images: body.images || [],
        timeline: body.timeline || null,
        deliveryNeeds: body.deliveryNeeds || null,
        status: "NEW",
      },
    });

    // Send confirmation email
    if (process.env.RESEND_API_KEY) {
      const resend = getResend();
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
        to: body.email,
        subject: "We received your business inquiry!",
        html: `
          <h1>Thanks for your inquiry, ${body.contactName}!</h1>
          <p>We've received your business pricing request for ${body.businessName} and will get back to you within 24 business hours.</p>
          <p>We work with businesses of all sizes and offer:</p>
          <ul>
            <li>Volume pricing for bulk orders</li>
            <li>Consistent frame styles across projects</li>
            <li>Net-30 invoicing for established accounts</li>
            <li>Delivery and professional installation</li>
          </ul>
          <p>We look forward to working with you!</p>
          <p>
            <strong>Model Home Art</strong><br>
            2550 S. Fairview St., Santa Ana, CA 92704<br>
            (714) 878-2919
          </p>
        `,
      });

      // Send notification to admin
      if (process.env.ADMIN_EMAIL) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `Business Inquiry: ${body.businessName}`,
          html: `
            <h1>New Business Inquiry</h1>
            <p><strong>Business:</strong> ${body.businessName}</p>
            <p><strong>Contact:</strong> ${body.contactName} (${body.email})</p>
            ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ""}
            <p><strong>Project:</strong> ${body.projectDescription || "N/A"}</p>
            <p><strong>Sizes:</strong> ${body.sizesInfo || "N/A"}</p>
            <p><strong>Timeline:</strong> ${body.timeline || "N/A"}</p>
            <p><strong>Delivery:</strong> ${body.deliveryNeeds || "N/A"}</p>
          `,
        });
      }
    }

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (error) {
    console.error("Business inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
