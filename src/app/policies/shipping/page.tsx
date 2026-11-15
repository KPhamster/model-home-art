import { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import Link from "next/link";
import { businessConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping information for Model Home Art ready-made frames and custom framing orders.",
};

export default function ShippingPolicyPage() {
  return (
    <>
    <PageHero compact title="Shipping Policy" />
    <div className="bg-background py-12 lg:py-16">
      <div className="container-wide max-w-3xl!">
        <div className="prose-custom text-muted-foreground">
          <section className="mb-10 border-b border-border pb-10">
            <h2 className="mb-4 font-heading text-2xl font-semibold tracking-tight text-foreground">Ready-Made Frames</h2>
            <ul className="space-y-2">
              <li>
                <strong>Processing Time:</strong> Orders ship within {businessConfig.shipping.processingDays}.
              </li>
              <li>
                <strong>Delivery Time:</strong> Standard delivery takes {businessConfig.shipping.deliveryDays} after shipping.
              </li>
              <li>
                <strong>Standard Shipping:</strong> ${(businessConfig.shipping.standardRate / 100).toFixed(2)} flat rate for orders under ${(businessConfig.shipping.freeThreshold / 100).toFixed(0)}.
              </li>
            </ul>
          </section>

          <section className="mb-10 border-b border-border pb-10">
            <h2 className="mb-4 font-heading text-2xl font-semibold tracking-tight text-foreground">Custom Framing Orders</h2>
            <p>
              Custom framing orders have different shipping arrangements based on the size and 
              nature of your project. When you receive your quote, we'll include shipping options 
              and pricing specific to your order.
            </p>
            <p className="mt-4">
              <strong>Local Pickup:</strong> Available at our Orange County, CA location at no charge.
            </p>
            <p className="mt-2">
              <strong>Local Delivery:</strong> We offer delivery throughout the United States. Delivery 
              fees are based on distance and will be included in your quote.
            </p>
            <p className="mt-2">
              <strong>Installation:</strong> Professional installation is available with local delivery. 
              Installation fees vary based on the number of pieces and complexity.
            </p>
          </section>

          <section className="mb-10 border-b border-border pb-10">
            <h2 className="mb-4 font-heading text-2xl font-semibold tracking-tight text-foreground">Packaging</h2>
            <p>
              All frames are carefully packaged to prevent damage during shipping. Ready-made 
              frames are boxed with protective corners and padding. Large or fragile items 
              receive additional protection.
            </p>
          </section>

          <section className="mb-10 border-b border-border pb-10">
            <h2 className="mb-4 font-heading text-2xl font-semibold tracking-tight text-foreground">Shipping Carriers</h2>
            <p>
              We ship via UPS, FedEx, and USPS depending on the size and destination of your order. 
              Tracking information is provided via email once your order ships.
            </p>
          </section>

          <section className="mb-10 border-b border-border pb-10">
            <h2 className="mb-4 font-heading text-2xl font-semibold tracking-tight text-foreground">Damaged Shipments</h2>
            <p>
              If your order arrives damaged, please contact us within 48 hours with photos of 
              the damage. We'll arrange a replacement or refund as appropriate. See our{" "}
              <Link href="/policies/returns" className="text-primary hover:underline">
                Returns Policy
              </Link>{" "}
              for more information.
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-2xl font-semibold tracking-tight text-foreground">Questions?</h2>
            <p>
              Contact us at{" "}
              <a href={`mailto:${businessConfig.email}`} className="text-primary hover:underline">
                {businessConfig.email}
              </a>{" "}
              or{" "}
              <a href={`tel:${businessConfig.phone}`} className="text-primary hover:underline">
                {businessConfig.phone}
              </a>{" "}
              with any shipping questions.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
