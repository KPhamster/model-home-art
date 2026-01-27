import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { quoteOptions, businessConfig } from "@/lib/config";

// App Router config: Allow longer processing time for large uploads
export const maxDuration = 60;

// Lazy initialization to avoid build-time errors
const getResend = () => new Resend(process.env.RESEND_API_KEY);

// Helper function to get display label from value
const getLabel = (options: readonly { value: string; label: string }[], value: string): string => {
  const found = options.find((opt) => opt.value === value);
  return found ? found.label : value || "Not specified";
};

// Helper to capitalize first letter
const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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
    
    // Get file extension from name or mime type
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

// Legacy: Parse base64 images (for backwards compatibility)
const parseBase64Images = (images: string[]): ImageAttachment[] => {
  return images.map((base64String, index) => {
    // Parse data URL format: data:image/jpeg;base64,/9j/4AAQ...
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    
    if (!matches) {
      // If not a data URL, assume it's raw base64 jpeg
      return {
        filename: `photo-${index + 1}.jpg`,
        content: Buffer.from(base64String, 'base64'),
        contentType: 'image/jpeg',
      };
    }

    const [, imageType, base64Data] = matches;
    const extension = imageType === 'jpeg' ? 'jpg' : imageType;
    
    return {
      filename: `photo-${index + 1}.${extension}`,
      content: Buffer.from(base64Data, 'base64'),
      contentType: `image/${imageType}`,
    };
  });
};

// Generate customer confirmation email HTML
const generateCustomerEmailHtml = (body: any, imageCount: number): string => {
  const sizeDisplay = body.notSureSize
    ? "Not sure — help me measure"
    : body.width && body.height
    ? `${body.width}" × ${body.height}"`
    : "Not specified";

  // Create image placeholders that reference attachments
  const imagesHtml = imageCount > 0
    ? Array.from({ length: imageCount }, (_, i) =>
        `<div style="display: inline-block; width: 100px; height: 100px; margin: 8px; border-radius: 8px; background-color: #f5f5f4; border: 1px solid #e7e5e4; text-align: center; line-height: 100px;">
          <span style="color: #78716c; font-size: 12px;">📷 Photo ${i + 1}</span>
        </div>`
      ).join("")
    : "";

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
        <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0;">Quote Request Received!</h2>
      </div>

      <!-- Content -->
      <div style="padding: 32px;">
        <p style="color: #44403c; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
          Hi <strong>${body.name}</strong>,<br><br>
          Thank you for choosing Model Home Art! We've received your quote request and our team will review it carefully. You can expect to hear back from us within <strong>${businessConfig.responseTime}</strong> with framing options tailored to your budget and preferences.
        </p>

        <!-- Request Summary -->
        <div style="background-color: #fafaf9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h3 style="color: #292524; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 12px;">📋 Your Request Summary</h3>
          
          <!-- Item Details -->
          <div style="margin-bottom: 20px;">
            <h4 style="color: #78716c; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Item Details</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px; width: 140px;">Category:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${capitalize(body.category)}</td>
              </tr>
              ${body.description ? `<tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px; vertical-align: top;">Description:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px;">${body.description}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Size:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${sizeDisplay}</td>
              </tr>
              ${body.repairsNeeded ? `<tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px; vertical-align: top;">Repairs Needed:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px;">Yes${body.repairNotes ? ` — ${body.repairNotes}` : ""}</td>
              </tr>` : ""}
            </table>
          </div>

          <!-- Style Preferences -->
          <div style="margin-bottom: 20px;">
            <h4 style="color: #78716c; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Style Preferences</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px; width: 140px;">Frame Style:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.styles, body.stylePreference)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Matting:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.matting, body.matting)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Glass/Protection:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.protection, body.protection)}</td>
              </tr>
              ${body.budgetRange ? `<tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Budget Range:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.budget, body.budgetRange)}</td>
              </tr>` : ""}
            </table>
          </div>

          <!-- Timeline & Service -->
          <div style="margin-bottom: 20px;">
            <h4 style="color: #78716c; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Timeline & Service</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px; width: 140px;">Timeline:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.timeline, body.timeline)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Delivery Method:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.services, body.services?.[0] || body.service)}</td>
              </tr>
              ${body.zipCode ? `<tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Zip Code:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${body.zipCode}</td>
              </tr>` : ""}
            </table>
          </div>

          <!-- Contact Info -->
          <div>
            <h4 style="color: #78716c; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Your Contact Info</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px; width: 140px;">Name:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${body.name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Email:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${body.email}</td>
              </tr>
              ${body.phone ? `<tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Phone:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${body.phone}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 6px 0; color: #78716c; font-size: 14px;">Preferred Contact:</td>
                <td style="padding: 6px 0; color: #292524; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.contactMethods, body.preferredContact)}</td>
              </tr>
            </table>
          </div>
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
        ` : ""}

        <!-- What's Next -->
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h4 style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">⏰ What Happens Next?</h4>
          <p style="color: #78350f; font-size: 14px; line-height: 1.5; margin: 0;">
            Our team will review your request and prepare personalized framing options that fit your budget. We'll reach out via your preferred contact method (${getLabel(quoteOptions.contactMethods, body.preferredContact).toLowerCase()}) within ${businessConfig.responseTime}.
          </p>
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
const generateAdminEmailHtml = (body: any, quoteId: string, imageCount: number): string => {
  const sizeDisplay = body.notSureSize
    ? "Not sure — help me measure"
    : body.width && body.height
    ? `${body.width}" × ${body.height}"`
    : "Not specified";

  // Create image placeholders that reference attachments
  const imagesHtml = imageCount > 0
    ? Array.from({ length: imageCount }, (_, i) =>
        `<div style="display: inline-block; width: 120px; height: 120px; margin: 8px; border-radius: 8px; background-color: #e7e5e4; border: 2px dashed #a8a29e; text-align: center; vertical-align: middle;">
          <div style="padding-top: 35px;">
            <span style="font-size: 24px;">📷</span>
            <p style="color: #57534e; font-size: 12px; margin: 4px 0 0 0; font-weight: 500;">Photo ${i + 1}</p>
          </div>
        </div>`
      ).join("")
    : "<em style='color: #78716c;'>No images uploaded</em>";

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
      <h1 style="color: #292524; font-size: 24px; font-weight: 600; margin: 0;">🖼️ New Quote Request</h1>
      <p style="color: #78716c; font-size: 14px; margin: 8px 0 0 0;">${createdAt}</p>
    </div>

    <!-- Main Card -->
    <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Customer Banner -->
      <div style="background-color: #292524; padding: 20px 24px; display: flex; align-items: center;">
        <div style="flex: 1;">
          <h2 style="color: #ffffff; font-size: 20px; font-weight: 600; margin: 0;">${body.name}</h2>
          <p style="color: #a8a29e; font-size: 14px; margin: 4px 0 0 0;">${capitalize(body.category)} • ${getLabel(quoteOptions.budget, body.budgetRange)}</p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; background-color: #22c55e; color: #ffffff; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">New</span>
        </div>
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
            <tr>
              <td style="padding: 4px 16px 4px 0; color: #1e40af; font-size: 14px;">Preferred:</td>
              <td style="padding: 4px 0; color: #1e3a8a; font-size: 14px; font-weight: 500;">${getLabel(quoteOptions.contactMethods, body.preferredContact)}</td>
            </tr>
          </table>
        </div>

        <!-- Two Column Layout -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 12px;">
              <!-- Item Details -->
              <div style="background-color: #fafaf9; border-radius: 8px; padding: 16px; height: 100%;">
                <h4 style="color: #292524; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">📦 Item Details</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Category:</td>
                    <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600; text-align: right;">${capitalize(body.category)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Size:</td>
                    <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600; text-align: right;">${sizeDisplay}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Repairs:</td>
                    <td style="padding: 4px 0; color: ${body.repairsNeeded ? "#dc2626" : "#292524"}; font-size: 13px; font-weight: 600; text-align: right;">${body.repairsNeeded ? "Yes" : "No"}</td>
                  </tr>
                </table>
                ${body.description ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e7e5e4;">
                  <p style="color: #78716c; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0;">Description:</p>
                  <p style="color: #292524; font-size: 13px; margin: 0; line-height: 1.4;">${body.description}</p>
                </div>` : ""}
                ${body.repairsNeeded && body.repairNotes ? `<div style="margin-top: 8px;">
                  <p style="color: #78716c; font-size: 11px; text-transform: uppercase; margin: 0 0 4px 0;">Repair Notes:</p>
                  <p style="color: #dc2626; font-size: 13px; margin: 0; line-height: 1.4;">${body.repairNotes}</p>
                </div>` : ""}
              </div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 12px;">
              <!-- Style Preferences -->
              <div style="background-color: #fafaf9; border-radius: 8px; padding: 16px; height: 100%;">
                <h4 style="color: #292524; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">🎨 Style Preferences</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Frame Style:</td>
                    <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600; text-align: right;">${getLabel(quoteOptions.styles, body.stylePreference)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Matting:</td>
                    <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600; text-align: right;">${getLabel(quoteOptions.matting, body.matting)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Protection:</td>
                    <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600; text-align: right;">${getLabel(quoteOptions.protection, body.protection)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Budget:</td>
                    <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600; text-align: right;">${getLabel(quoteOptions.budget, body.budgetRange)}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

        <!-- Timeline & Service -->
        <div style="background-color: #fafaf9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <h4 style="color: #292524; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">🚚 Timeline & Delivery</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; color: #78716c; font-size: 13px; width: 150px;">Timeline:</td>
              <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600;">${getLabel(quoteOptions.timeline, body.timeline)}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Delivery Method:</td>
              <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600;">${getLabel(quoteOptions.services, body.services?.[0] || body.service)}</td>
            </tr>
            ${body.zipCode ? `<tr>
              <td style="padding: 4px 0; color: #78716c; font-size: 13px;">Zip Code:</td>
              <td style="padding: 4px 0; color: #292524; font-size: 13px; font-weight: 600;">${body.zipCode}</td>
            </tr>` : ""}
          </table>
        </div>

        <!-- Customer Images -->
        <div style="margin-bottom: 24px;">
          <h4 style="color: #292524; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">📸 Customer Photos</h4>
          ${imageCount > 0 ? `
          <div style="background-color: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="color: #1e40af; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">📎 ${imageCount} photo${imageCount > 1 ? 's' : ''} attached</p>
            <p style="color: #1d4ed8; font-size: 13px; margin: 0;">Download attachments to view customer's uploaded photos</p>
          </div>
          ` : `
          <div style="background-color: #fafaf9; border-radius: 8px; padding: 16px; text-align: center;">
            <em style="color: #78716c;">No images uploaded</em>
          </div>
          `}
        </div>

        <!-- Action Button -->
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e7e5e4;">
          <a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || "https://modelhomeart.com"}/admin/quotes/${quoteId}" style="display: inline-block; background-color: #292524; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">View Full Details in Admin →</a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #a8a29e; font-size: 12px; margin: 0;">
        Quote ID: ${quoteId} • Model Home Art Admin
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
      // Parse as FormData (binary file upload - more efficient)
      const formData = await request.formData();
      
      // Get form fields from JSON string
      const formDataJson = formData.get('formData');
      if (formDataJson && typeof formDataJson === 'string') {
        body = JSON.parse(formDataJson);
      } else {
        throw new Error('Missing formData field');
      }
      
      // Collect image files
      for (let i = 0; i < 3; i++) {
        const file = formData.get(`image${i}`);
        if (file && file instanceof File) {
          imageFiles.push(file);
        }
      }
    } else {
      // Parse as JSON (legacy base64 method)
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
  if (!body.category || !body.name || !body.email) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let quote;
  
  // Save to database
  // Note: We don't store full images in the database (too large)
  // Images are sent via email attachments instead
  // Store a placeholder to indicate how many images were uploaded
  const imageCount = imageFiles.length || body.images?.length || 0;
  const imagePlaceholders = Array.from(
    { length: imageCount }, 
    (_, i) => `[image-${i + 1}-attached-to-email]`
  );
  
  try {
    quote = await prisma.quoteRequest.create({
      data: {
        category: body.category,
        description: body.description || "",
        width: body.width || null,
        height: body.height || null,
        notSureSize: body.notSureSize || false,
        images: imagePlaceholders, // Store placeholders, not full image data
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
  } catch (dbError: any) {
    console.error("Database error saving quote:", dbError);
    // Return more details for debugging
    const errorMessage = dbError?.message || "Unknown database error";
    const errorCode = dbError?.code || "UNKNOWN";
    return NextResponse.json(
      { 
        error: "Failed to save quote request",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
        code: errorCode,
      },
      { status: 500 }
    );
  }

  // Send emails (non-blocking - don't fail the request if email fails)
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = getResend();
      
      // Parse images for attachments
      let imageAttachments: ImageAttachment[] = [];
      try {
        if (imageFiles.length > 0) {
          // New method: File objects from FormData
          imageAttachments = await parseFileAttachments(imageFiles);
        } else if (body.images?.length) {
          // Legacy method: base64 strings
          imageAttachments = parseBase64Images(body.images);
        }
      } catch (imageError) {
        console.error("Error parsing images for email:", imageError);
        // Continue without attachments
      }
      
      // Calculate total attachment size - Resend has a ~40MB limit
      const totalAttachmentSize = imageAttachments.reduce(
        (sum, att) => sum + att.content.length, 
        0
      );
      
      // Only include attachments if under 25MB (leave room for email content)
      const includeAttachments = totalAttachmentSize < 25 * 1024 * 1024;
      
      // Format attachments for Resend
      const resendAttachments = includeAttachments 
        ? imageAttachments.map((att) => ({
            filename: att.filename,
            content: att.content,
            content_type: att.contentType,
          }))
        : [];

      // Customer confirmation email
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "Model Home Art <hello@modelhomeart.com>",
          to: body.email,
          subject: `Thanks for your quote request, ${body.name}! — Model Home Art`,
          html: generateCustomerEmailHtml(body, imageAttachments.length),
          attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
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
            subject: `🖼️ New Quote: ${capitalize(body.category)} from ${body.name} (${getLabel(quoteOptions.budget, body.budgetRange)})`,
            html: generateAdminEmailHtml(body, quote.id, imageAttachments.length),
            attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
          });
        } catch (adminEmailError) {
          console.error("Error sending admin email:", adminEmailError);
          // Continue - don't fail the request
        }
      }
    }
  } catch (emailError) {
    console.error("Email sending error:", emailError);
    // Don't fail the request - quote was saved
  }

  // Send Slack notification if configured (non-blocking)
  try {
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `🖼️ New Quote Request from ${body.name}\nCategory: ${body.category}\nBudget: ${body.budgetRange || "Not specified"}`,
        }),
      });
    }
  } catch (slackError) {
    console.error("Slack notification error:", slackError);
    // Don't fail the request
  }

  return NextResponse.json({ success: true, id: quote.id });
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
