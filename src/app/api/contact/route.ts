import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { businessConfig } from "@/lib/config";

// Lazy initialization to avoid build-time errors
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Generate customer confirmation email HTML
const generateCustomerEmailHtml = (body: any): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #292524; font-size: 28px; font-weight: 600; margin: 0 0 8px 0;">Model Home Art</h1>
      <p style="color: #78716c; font-size: 14px; margin: 0;">Custom Framing Excellence</p>
    </div>

    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Success Banner -->
      <div style="background-color: #22c55e; padding: 24px; text-align: center;">
        <div style="width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 12px; line-height: 48px; text-align: center;">
          <span style="color: white; font-size: 24px; vertical-align: middle;">✓</span>
        </div>
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0;">Message Received!</h2>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          Hi <strong>${body.name}</strong>,<br><br>
          Thank you for reaching out to Model Home Art! We've received your message and will get back to you within <strong>${businessConfig.responseTime}</strong>.
        </p>

        <!-- Message Summary -->
        <div style="background-color: #fafaf9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #292524; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 12px;">📋 Your Message</h3>
          
          ${body.subject ? `<p style="color: #78716c; font-size: 13px; margin: 0 0 4px 0;">Subject:</p>
          <p style="color: #292524; font-size: 14px; font-weight: 500; margin: 0 0 16px 0;">${body.subject}</p>` : ""}
          
          <p style="color: #78716c; font-size: 13px; margin: 0 0 4px 0;">Message:</p>
          <p style="color: #292524; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${body.message}</p>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-bottom: 24px;">
          <p style="color: #78716c; font-size: 14px; margin: 0 0 16px 0;">Need a framing quote? Get faster service with photos:</p>
          <a href="https://modelhomeart.com/quote" style="display: inline-block; background-color: #292524; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500;">Get a Fast Quote</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #fafaf9; padding: 24px; border-top: 1px solid #e7e5e4;">
        <div style="text-align: center;">
          <p style="color: #292524; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">Model Home Art</p>
          <p style="color: #78716c; font-size: 13px; margin: 0 0 4px 0;">${businessConfig.address.full}</p>
          <p style="color: #78716c; font-size: 13px; margin: 0 0 4px 0;">${businessConfig.phone}</p>
          <p style="color: #78716c; font-size: 13px; margin: 0 0 12px 0;">${businessConfig.hours.display}</p>
          <a href="${businessConfig.googleMapsUrl}" style="color: #2563eb; font-size: 13px; text-decoration: none;">Get Directions →</a>
        </div>
      </div>
    </div>

    <!-- Legal Footer -->
    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #a8a29e; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Model Home Art. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generate admin notification email HTML
const generateAdminEmailHtml = (body: any): string => {
  const createdAt = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #292524; font-size: 24px; font-weight: 600; margin: 0;">📬 New Contact Message</h1>
      <p style="color: #78716c; font-size: 14px; margin: 8px 0 0 0;">${createdAt}</p>
    </div>

    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Customer Banner -->
      <div style="background-color: #292524; padding: 20px 24px;">
        <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0;">${body.name}</h2>
        <p style="color: #a8a29e; font-size: 14px; margin: 4px 0 0 0;">${body.subject || "General Inquiry"}</p>
      </div>

      <!-- Content -->
      <div style="padding: 24px;">
        <!-- Quick Contact -->
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h3 style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">📞 Quick Contact</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 16px 4px 0; color: #1e40af; font-size: 14px;">Email:</td>
              <td style="padding: 4px 0; font-size: 14px;"><a href="mailto:${body.email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${body.email}</a></td>
            </tr>
            ${body.phone ? `<tr>
              <td style="padding: 4px 16px 4px 0; color: #1e40af; font-size: 14px;">Phone:</td>
              <td style="padding: 4px 0; font-size: 14px;"><a href="tel:${body.phone.replace(/[^0-9]/g, "")}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${body.phone}</a></td>
            </tr>` : ""}
          </table>
        </div>

        <!-- Message -->
        <div style="background-color: #fafaf9; border-radius: 8px; padding: 16px;">
          <h4 style="color: #292524; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">💬 Message</h4>
          <p style="color: #292524; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${body.message}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #a8a29e; font-size: 12px; margin: 0;">
        Model Home Art Admin
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || null,
        message: body.message,
      },
    });

    // Send emails
    if (process.env.RESEND_API_KEY) {
      const resend = getResend();

      // Customer confirmation email
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
          to: body.email,
          subject: `Thanks for your message, ${body.name}! — Model Home Art`,
          html: generateCustomerEmailHtml(body),
        });
      } catch (customerEmailError) {
        console.error("Error sending customer email:", customerEmailError);
        // Continue - don't fail the request
      }

      // Admin notification email
      if (process.env.ADMIN_EMAIL) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
            to: process.env.ADMIN_EMAIL,
            subject: `📬 Contact: ${body.subject || "New message"} from ${body.name}`,
            html: generateAdminEmailHtml(body),
            replyTo: body.email,
          });
        } catch (adminEmailError) {
          console.error("Error sending admin email:", adminEmailError);
          // Continue - don't fail the request
        }
      }
    }

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit message" },
      { status: 500 }
    );
  }
}
