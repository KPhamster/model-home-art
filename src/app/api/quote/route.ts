import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.category || !body.name || !body.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to database
    const quote = await prisma.quoteRequest.create({
      data: {
        category: body.category,
        description: body.description || "",
        width: body.width || null,
        height: body.height || null,
        notSureSize: body.notSureSize || false,
        images: body.images || [],
        repairsNeeded: body.repairsNeeded || false,
        repairNotes: body.repairNotes || null,
        stylePreference: body.stylePreference || null,
        matting: body.matting || null,
        protection: body.protection || null,
        budgetRange: body.budgetRange || null,
        timeline: body.timeline || null,
        services: body.services || [],
        zipCode: body.zipCode || null,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        preferredContact: body.preferredContact || null,
        status: "NEW",
      },
    });

    // Send confirmation email to customer
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
        to: body.email,
        subject: "We received your quote request!",
        html: `
          <h1>Thanks for your quote request, ${body.name}!</h1>
          <p>We've received your request and will get back to you within 24 business hours with framing options that fit your budget.</p>
          <p><strong>What you requested:</strong></p>
          <ul>
            <li>Category: ${body.category}</li>
            ${body.width && body.height ? `<li>Size: ${body.width}" × ${body.height}"</li>` : ""}
            ${body.budgetRange ? `<li>Budget: ${body.budgetRange}</li>` : ""}
          </ul>
          <p>In the meantime, feel free to visit our shop or call us if you have questions.</p>
          <p>
            <strong>Model Home Art</strong><br>
            [ADDRESS]<br>
            [PHONE]
          </p>
        `,
      });

      // Send notification to admin
      if (process.env.ADMIN_EMAIL) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `New Quote Request: ${body.category} from ${body.name}`,
          html: `
            <h1>New Quote Request</h1>
            <p><strong>From:</strong> ${body.name} (${body.email})</p>
            <p><strong>Category:</strong> ${body.category}</p>
            <p><strong>Description:</strong> ${body.description || "N/A"}</p>
            <p><strong>Size:</strong> ${body.width && body.height ? `${body.width}" × ${body.height}"` : body.notSureSize ? "Not sure" : "N/A"}</p>
            <p><strong>Budget:</strong> ${body.budgetRange || "N/A"}</p>
            <p><strong>Timeline:</strong> ${body.timeline || "N/A"}</p>
            <p><strong>Services:</strong> ${body.services?.join(", ") || "N/A"}</p>
            <p><a href="${process.env.NEXTAUTH_URL}/admin/quotes/${quote.id}">View in Admin</a></p>
          `,
        });
      }
    }

    // Send Slack notification if configured
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🖼️ New Quote Request from ${body.name}\nCategory: ${body.category}\nBudget: ${body.budgetRange || "Not specified"}`,
        }),
      });
    }

    return NextResponse.json({ success: true, id: quote.id });
  } catch (error) {
    console.error("Quote submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where = status ? { status: status as any } : {};

    const [quotes, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
