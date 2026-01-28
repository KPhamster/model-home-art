import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { businessConfig } from "@/lib/config";

// App Router config: Allow longer processing time for large uploads
export const maxDuration = 60;

// Lazy initialization to avoid build-time errors
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Helper interface for image attachments
interface ImageAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

// Parse File objects from FormData into attachments
const parseFileAttachments = async (files: File[]): Promise<ImageAttachment[]> => {
  const attachments: ImageAttachment[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const extension = file.name.split('.').pop() || 
      (file.type.includes('jpeg') ? 'jpg' : file.type.split('/')[1]) || 
      'jpg';
    
    attachments.push({
      filename: `photo-${i + 1}.${extension}`,
      content: buffer,
      contentType: file.type || 'image/jpeg',
    });
  }
  
  return attachments;
};

// Generate customer confirmation email HTML
const generateCustomerEmailHtml = (body: any, imageCount: number, imageLink?: string): string => {
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
      <p style="color: #78716c; font-size: 14px; margin: 0;">Business Framing Services</p>
    </div>

    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Success Banner -->
      <div style="background-color: #22c55e; padding: 24px; text-align: center;">
        <div style="width: 48px; height: 48px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 12px; line-height: 48px; text-align: center;">
          <span style="color: white; font-size: 24px; vertical-align: middle;">✓</span>
        </div>
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0;">Business Inquiry Received!</h2>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          Hi <strong>${body.contactName}</strong>,<br><br>
          Thank you for your interest in our business framing services for <strong>${body.businessName}</strong>! We've received your inquiry and will get back to you within <strong>24 business hours</strong> with pricing options.
        </p>

        <!-- Request Summary -->
        <div style="background-color: #fafaf9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #292524; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 12px;">📋 Your Request Summary</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px; width: 140px;">Business:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${body.businessName}</td>
            </tr>
            ${body.projectDescription ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px; vertical-align: top;">Project:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 14px;">${body.projectDescription}</td>
            </tr>` : ""}
            ${body.sizesInfo ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px; vertical-align: top;">Sizes/Quantities:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 14px;">${body.sizesInfo}</td>
            </tr>` : ""}
            ${body.timeline ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Timeline:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${body.timeline}</td>
            </tr>` : ""}
            ${body.deliveryNeeds ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Delivery/Install:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${body.deliveryNeeds}</td>
            </tr>` : ""}
          </table>
        </div>

        ${imageCount > 0 ? `
        <!-- Uploaded Images -->
        <div style="margin-bottom: 24px;">
          <h4 style="color: #292524; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">📸 Your Uploaded Photos</h4>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="color: #166534; font-size: 14px; font-weight: 500; margin: 0 0 8px 0;">✓ ${imageCount} photo${imageCount > 1 ? 's' : ''} attached to this email</p>
            <p style="color: #15803d; font-size: 13px; margin: 0;">Check your email attachments to view your uploaded photos.</p>
          </div>
        </div>
        ` : imageLink ? `
        <!-- Image Link -->
        <div style="margin-bottom: 24px;">
          <h4 style="color: #292524; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">📸 Your Photos</h4>
          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px;">
            <p style="color: #1e40af; font-size: 14px; font-weight: 500; margin: 0 0 8px 0;">You provided a link to your photos:</p>
            <a href="${imageLink}" style="color: #2563eb; font-size: 13px; word-break: break-all;">${imageLink}</a>
          </div>
        </div>
        ` : ""}

        <!-- What We Offer -->
        <div style="background-color: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h4 style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">🏢 Our Business Services</h4>
          <ul style="color: #1e3a8a; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Volume pricing for bulk orders</li>
            <li>Consistent frame styles across projects</li>
            <li>Delivery and professional installation</li>
          </ul>
        </div>

        <!-- CTA -->
        <div style="text-align: center; margin-bottom: 24px;">
          <p style="color: #78716c; font-size: 14px; margin: 0 0 16px 0;">Have questions while you wait?</p>
          <a href="tel:${businessConfig.phone.replace(/[^0-9]/g, "")}" style="display: inline-block; background-color: #292524; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; margin-right: 8px;">Call Us</a>
          <a href="mailto:${businessConfig.email}" style="display: inline-block; background-color: #f5f5f4; color: #292524; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; border: 1px solid #e7e5e4;">Email Us</a>
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
const generateAdminEmailHtml = (body: any, imageCount: number, imageLink?: string): string => {
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
  <div style="max-width: 700px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #292524; font-size: 24px; font-weight: 600; margin: 0;">🏢 New Business Inquiry</h1>
      <p style="color: #78716c; font-size: 14px; margin: 8px 0 0 0;">${createdAt}</p>
    </div>

    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Business Banner -->
      <div style="background-color: #292524; padding: 20px 24px;">
        <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0;">${body.businessName}</h2>
        <p style="color: #a8a29e; font-size: 14px; margin: 4px 0 0 0;">Contact: ${body.contactName}</p>
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

        <!-- Project Details -->
        <div style="background-color: #fafaf9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h4 style="color: #292524; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">📋 Project Details</h4>
          <table style="width: 100%; border-collapse: collapse;">
            ${body.projectDescription ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 13px; vertical-align: top; width: 140px;">Description:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 13px; white-space: pre-wrap;">${body.projectDescription}</td>
            </tr>` : ""}
            ${body.sizesInfo ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 13px; vertical-align: top;">Sizes/Quantities:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 13px; white-space: pre-wrap;">${body.sizesInfo}</td>
            </tr>` : ""}
            ${body.timeline ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 13px;">Timeline:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 13px; font-weight: 600;">${body.timeline}</td>
            </tr>` : ""}
            ${body.deliveryNeeds ? `<tr>
              <td style="padding: 6px 0; color: #78716c; font-size: 13px;">Delivery/Install:</td>
              <td style="padding: 6px 0; color: #292524; font-size: 13px; font-weight: 600;">${body.deliveryNeeds}</td>
            </tr>` : ""}
          </table>
        </div>

        <!-- Photos -->
        <div style="margin-bottom: 24px;">
          <h4 style="color: #292524; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">📸 Photos</h4>
          ${imageCount > 0 ? `
          <div style="background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">📎 ${imageCount} photo${imageCount > 1 ? 's' : ''} attached</p>
            <p style="color: #1d4ed8; font-size: 13px; margin: 0;">Download attachments to view photos</p>
          </div>
          ` : imageLink ? `
          <div style="background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px;">
            <p style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">🔗 Customer provided a link to photos:</p>
            <a href="${imageLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 13px; font-weight: 500;">Open Photos Link →</a>
            <p style="color: #1d4ed8; font-size: 12px; margin: 8px 0 0 0; word-break: break-all;">${imageLink}</p>
          </div>
          ` : `
          <div style="background-color: #fafaf9; border-radius: 8px; padding: 16px; text-align: center;">
            <em style="color: #78716c;">No photos provided</em>
          </div>
          `}
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
  let body: any;
  let imageFiles: File[] = [];
  
  // Check content type to determine how to parse
  const contentType = request.headers.get('content-type') || '';
  
  try {
    if (contentType.includes('multipart/form-data')) {
      // Parse as FormData (binary file upload)
      const formData = await request.formData();
      
      const formDataJson = formData.get('formData');
      if (formDataJson && typeof formDataJson === 'string') {
        body = JSON.parse(formDataJson);
      } else {
        throw new Error('Missing formData field');
      }
      
      // Collect image files (up to 5)
      for (let i = 0; i < 5; i++) {
        const file = formData.get(`image${i}`);
        if (file && file instanceof File) {
          imageFiles.push(file);
        }
      }
    } else {
      // Parse as JSON (legacy)
      body = await request.json();
    }
  } catch (parseError) {
    console.error("Failed to parse request body:", parseError);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!body.businessName || !body.contactName || !body.email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Store placeholders for images
  const imageCount = imageFiles.length;
  const imagePlaceholders = Array.from(
    { length: imageCount }, 
    (_, i) => `[image-${i + 1}-attached-to-email]`
  );

  // Save to database
  let inquiry;
  try {
    inquiry = await prisma.businessInquiry.create({
      data: {
        businessName: body.businessName,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone || null,
        projectDescription: body.projectDescription || null,
        sizesInfo: body.sizesInfo || null,
        images: imagePlaceholders,
        timeline: body.timeline || null,
        deliveryNeeds: body.deliveryNeeds || null,
        status: "NEW",
      },
    });
  } catch (dbError: any) {
    console.error("Database error:", dbError);
    return NextResponse.json(
      { error: "Failed to save inquiry" },
      { status: 500 }
    );
  }

  // Send emails
  if (process.env.RESEND_API_KEY) {
    const resend = getResend();
    
    // Parse images for attachments
    let imageAttachments: ImageAttachment[] = [];
    try {
      if (imageFiles.length > 0) {
        imageAttachments = await parseFileAttachments(imageFiles);
      }
    } catch (imageError) {
      console.error("Error parsing images for email:", imageError);
    }
    
    // Calculate total attachment size
    const totalAttachmentSize = imageAttachments.reduce(
      (sum, att) => sum + att.content.length, 
      0
    );
    
    // Only include attachments if under 25MB
    const includeAttachments = totalAttachmentSize < 25 * 1024 * 1024;
    
    const resendAttachments = includeAttachments 
      ? imageAttachments.map((att) => ({
          filename: att.filename,
          content: att.content,
          content_type: att.contentType,
        }))
      : [];

    const imageLink = body.imageLink || undefined;

    // Customer confirmation email
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
        to: body.email,
        subject: `Thanks for your inquiry, ${body.contactName}! — Model Home Art`,
        html: generateCustomerEmailHtml(body, imageAttachments.length, imageLink),
        attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
      });
    } catch (customerEmailError) {
      console.error("Error sending customer email:", customerEmailError);
    }

    // Admin notification email
    if (process.env.ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
          to: process.env.ADMIN_EMAIL,
          subject: `🏢 Business Inquiry: ${body.businessName}`,
          html: generateAdminEmailHtml(body, imageAttachments.length, imageLink),
          attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
          replyTo: body.email,
        });
      } catch (adminEmailError) {
        console.error("Error sending admin email:", adminEmailError);
      }
    }
  }

  return NextResponse.json({ success: true, id: inquiry.id });
}
