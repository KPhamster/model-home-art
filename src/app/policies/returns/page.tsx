import { Metadata } from "next";
import Link from "next/link";
import { businessConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Returns Policy",
  description: "Return and exchange policy for Model Home Art frames and custom framing services.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="py-12 lg:py-16">
      <div className="container-wide max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
          Returns Policy
        </h1>

        <div className="prose-custom text-muted-foreground">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Ready-Made Frames</h2>
            <p>
              We want you to love your frames! Ready-made frames may be returned within 30 days 
              of delivery for a full refund, subject to the following conditions:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Items must be unused, in original packaging, and in resalable condition.</li>
              <li>Glass must be intact and unbroken.</li>
              <li>Return shipping is the responsibility of the customer unless the item arrived damaged or defective.</li>
              <li>Refunds are processed within 5-7 business days after we receive the return.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Custom Framing Orders</h2>
            <p>
              Custom framing is made specifically for you, so custom orders are generally non-refundable. 
              However, we stand behind our work:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Quality Guarantee:</strong> If there's a defect in materials or workmanship, 
                we'll repair or remake it at no charge.
              </li>
              <li>
                <strong>Satisfaction:</strong> If you're not satisfied with the result, contact us 
                within 7 days and we'll work with you to make it right.
              </li>
              <li>
                <strong>Damage in Transit:</strong> If your custom order arrives damaged, we'll 
                repair or remake it at no charge.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Exchanges</h2>
            <p>
              Want a different size or style? We're happy to process exchanges for ready-made 
              frames within 30 days. Contact us to arrange the exchange.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Damaged or Defective Items</h2>
            <p>
              If your order arrives damaged or defective:
            </p>
            <ol className="mt-4 list-decimal list-inside space-y-2">
              <li>Contact us within 48 hours of delivery.</li>
              <li>Send photos of the damage to {businessConfig.email}.</li>
              <li>We'll arrange a replacement or refund promptly.</li>
            </ol>
            <p className="mt-4">
              Please keep the original packaging until the issue is resolved.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">How to Return</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Contact us at{" "}
                <a href={`mailto:${businessConfig.email}`} className="text-primary hover:underline">
                  {businessConfig.email}
                </a>{" "}
                to request a return.
              </li>
              <li>We'll provide a return shipping address and any necessary instructions.</li>
              <li>Pack the item securely in its original packaging.</li>
              <li>Ship the item and provide tracking information.</li>
              <li>Refund will be processed within 5-7 business days of receipt.</li>
            </ol>
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
              with any questions about returns.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
