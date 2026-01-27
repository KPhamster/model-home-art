import { Metadata } from "next";
import Link from "next/link";
import { businessConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping information for Model Home Art ready-made frames and custom framing orders.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container-wide max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
          Shipping Policy
        </h1>

        <div className="prose-custom text-muted-foreground">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Ready-Made Frames</h2>
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

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Custom Framing Orders</h2>
            <p>
              Custom framing orders have different shipping arrangements based on the size and 
              nature of your project. When you receive your quote, we'll include shipping options 
              and pricing specific to your order.
            </p>
            <p className="mt-4">
              <strong>Local Pickup:</strong> Available at our Orange County location at no charge.
            </p>
            <p className="mt-2">
              <strong>Local Delivery:</strong> We offer delivery throughout Orange County. Delivery 
              fees are based on distance and will be included in your quote.
            </p>
            <p className="mt-2">
              <strong>Installation:</strong> Professional installation is available with local delivery. 
              Installation fees vary based on the number of pieces and complexity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Packaging</h2>
            <p>
              All frames are carefully packaged to prevent damage during shipping. Ready-made 
              frames are boxed with protective corners and padding. Large or fragile items 
              receive additional protection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Carriers</h2>
            <p>
              We ship via UPS, FedEx, and USPS depending on the size and destination of your order. 
              Tracking information is provided via email once your order ships.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Damaged Shipments</h2>
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
            <h2 className="text-xl font-semibold text-foreground mb-4">Questions?</h2>
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
  );
}
