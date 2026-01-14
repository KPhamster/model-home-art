import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send notification email to admin
    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
        to: process.env.ADMIN_EMAIL,
        subject: `Contact Form: ${body.subject || "New message"} from ${body.name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>From:</strong> ${body.name} (${body.email})</p>
          ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ""}
          <p><strong>Subject:</strong> ${body.subject || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${body.message.replace(/\n/g, "<br>")}</p>
        `,
        replyTo: body.email,
      });
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
